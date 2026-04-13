package hla

import (
	"fmt"
	"strings"
)

// =============================================================================
// Phase 3.7: FOM Parser Extensions - Datatypes, Code Generation, Module Merging
// Missing: enumeration parsing, array/record parsing, Go struct generation, FOM merging
// =============================================================================

// ParseEnumerationDatatypes parses enumeration datatype definitions from FOM
func (p *FOMParser) ParseEnumerationDatatypes() []DatatypeDefinition {
	enums := make([]DatatypeDefinition, 0)
	for _, dt := range p.module.Datatypes {
		if dt.Kind == DatatypeEnumerated {
			enums = append(enums, dt)
		}
	}
	return enums
}

// ParseArrayDatatypes parses array datatype definitions from FOM
func (p *FOMParser) ParseArrayDatatypes() []DatatypeDefinition {
	arrays := make([]DatatypeDefinition, 0)
	for _, dt := range p.module.Datatypes {
		if dt.Kind == DatatypeArray {
			arrays = append(arrays, dt)
		}
	}
	return arrays
}

// ParseRecordDatatypes parses record (fixed record) datatype definitions from FOM
func (p *FOMParser) ParseRecordDatatypes() []DatatypeDefinition {
	records := make([]DatatypeDefinition, 0)
	for _, dt := range p.module.Datatypes {
		if dt.Kind == DatatypeRecord {
			records = append(records, dt)
		}
	}
	return records
}

// GetRecordDefinition returns full record definition with field layout
func (m *FOMModule) GetRecordDefinition(typeName string) *RecordDefinition {
	for _, dt := range m.Datatypes {
		if dt.Name == typeName && dt.Kind == DatatypeRecord {
			rec := &RecordDefinition{
				Name:   dt.Name,
				Fields: make([]Field, 0),
			}
			offset := 0
			for _, f := range dt.Fields {
				size := estimateSize(f.Datatype)
				rec.Fields = append(rec.Fields, Field{
					Name:     f.Name,
					Datatype: f.Datatype,
					Offset:   offset,
					Size:     size,
				})
				offset += size
			}
			rec.Size = offset
			return rec
		}
	}
	return nil
}

// estimateSize estimates the byte size of a datatype
func estimateSize(datatype string) int {
	lower := strings.ToLower(datatype)
	switch lower {
	case "short", "uint16", "int16":
		return 2
	case "long", "uint32", "int32", "float":
		return 4
	case "quad", "uint64", "int64", "double":
		return 8
	case "byte", "uint8", "int8", "char":
		return 1
	default:
		return 4 // default pointer size
	}
}

// =============================================================================
// Phase 3.7.8: Generate Go struct from FOM object class
// =============================================================================

// GoStructField represents a Go struct field
type GoStructField struct {
	Name    string
	Type    string
	Tags    string
	Comment string
}

// GoStruct represents a generated Go struct
type GoStruct struct {
	Name    string
	Package string
	Fields  []GoStructField
	Imports []string
}

// GenerateGoStruct generates a Go struct from an FOM object class
func (m *FOMModule) GenerateGoStruct(className string) (*GoStruct, error) {
	objClass := m.GetObjectClass(className)
	if objClass == nil {
		return nil, fmt.Errorf("object class %s not found", className)
	}

	gs := &GoStruct{
		Name:    sanitizeName(objClass.Name),
		Package: "hla",
		Fields:  make([]GoStructField, 0),
	}

	// Add handle field
	gs.Fields = append(gs.Fields, GoStructField{
		Name: "Handle",
		Type: "uint32",
	})

	// Add attributes as fields
	for _, attr := range objClass.Attributes {
		field := GoStructField{
			Name: sanitizeName(attr.Name),
			Type: goType(attr.Datatype),
		}
		gs.Fields = append(gs.Fields, field)
	}

	return gs, nil
}

// sanitizeName converts a FOM name to a valid Go identifier
func sanitizeName(name string) string {
	name = strings.TrimPrefix(name, "HLAobjectRoot.")
	parts := strings.Split(name, ".")
	if len(parts) > 0 {
		name = parts[len(parts)-1]
	}
	// Capitalize first letter
	if len(name) > 0 {
		name = strings.ToUpper(name[:1]) + name[1:]
	}
	// Remove invalid chars
	name = strings.Map(func(r rune) rune {
		if r == '-' || r == ' ' {
			return '_'
		}
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '_' {
			return r
		}
		return '_'
	}, name)
	return name
}

// goType maps FOM datatype to Go type
func goType(fomType string) string {
	lower := strings.ToLower(fomType)
	switch {
	case strings.Contains(lower, "short"):
		return "int16"
	case strings.Contains(lower, "unsigned short"):
		return "uint16"
	case strings.Contains(lower, "long"):
		return "int32"
	case strings.Contains(lower, "unsigned long"):
		return "uint32"
	case strings.Contains(lower, "float"):
		return "float32"
	case strings.Contains(lower, "double"):
		return "float64"
	case strings.Contains(lower, "char"):
		return "byte"
	case strings.Contains(lower, "boolean"):
		return "bool"
	case strings.Contains(lower, "octet"):
		return "byte"
	default:
		return "interface{}"
	}
}

// String returns the Go source code for the struct
func (gs *GoStruct) String() string {
	var sb strings.Builder
	if gs.Package != "" {
		sb.WriteString(fmt.Sprintf("package %s\n\n", gs.Package))
	}
	sb.WriteString(fmt.Sprintf("type %s struct {\n", gs.Name))
	for _, f := range gs.Fields {
		if f.Comment != "" {
			sb.WriteString(fmt.Sprintf("\t// %s\n", f.Comment))
		}
		if f.Tags != "" {
			sb.WriteString(fmt.Sprintf("\t%s %s `%s`\n", f.Name, f.Type, f.Tags))
		} else {
			sb.WriteString(fmt.Sprintf("\t%s %s\n", f.Name, f.Type))
		}
	}
	sb.WriteString("}\n")
	return sb.String()
}

// =============================================================================
// Phase 3.7.9: Generate Go struct from FOM interaction class
// =============================================================================

// GenerateInteractionStruct generates a Go struct from an FOM interaction class
func (m *FOMModule) GenerateInteractionStruct(className string) (*GoStruct, error) {
	ic := m.GetInteractionClass(className)
	if ic == nil {
		return nil, fmt.Errorf("interaction class %s not found", className)
	}

	gs := &GoStruct{
		Name:    sanitizeName(ic.Name) + "Interaction",
		Package: "hla",
		Fields:  make([]GoStructField, 0),
	}

	// Add timestamp field
	gs.Fields = append(gs.Fields, GoStructField{
		Name: "Timestamp",
		Type: "time.Time",
	})

	// Add parameters as fields
	for _, param := range ic.Parameters {
		field := GoStructField{
			Name: sanitizeName(param.Name),
			Type: goType(param.Datatype),
		}
		gs.Fields = append(gs.Fields, field)
	}

	return gs, nil
}

// =============================================================================
// Phase 3.7.10: FOM Module Merging
// =============================================================================

// MergeModules merges multiple FOM modules into one
func MergeModules(modules []*FOMModule) *FOMModule {
	merged := &FOMModule{
		Name:               "MergedFOM",
		Version:            "1.0.0",
		ObjectClasses:      make([]ObjectClass, 0),
		InteractionClasses: make([]InteractionClass, 0),
		Datatypes:          make([]DatatypeDefinition, 0),
	}

	seenObjects := make(map[string]bool)
	seenInteractions := make(map[string]bool)
	seenDatatypes := make(map[string]bool)

	for _, mod := range modules {
		// Merge object classes
		for _, oc := range mod.ObjectClasses {
			key := oc.FullName
			if !seenObjects[key] {
				merged.ObjectClasses = append(merged.ObjectClasses, oc)
				seenObjects[key] = true
			}
		}

		// Merge interaction classes
		for _, ic := range mod.InteractionClasses {
			key := ic.FullName
			if !seenInteractions[key] {
				merged.InteractionClasses = append(merged.InteractionClasses, ic)
				seenInteractions[key] = true
			}
		}

		// Merge datatypes
		for _, dt := range mod.Datatypes {
			if !seenDatatypes[dt.Name] {
				merged.Datatypes = append(merged.Datatypes, dt)
				seenDatatypes[dt.Name] = true
			}
		}
	}

	return merged
}

// FOMModuleCollection manages a collection of FOM modules
type FOMModuleCollection struct {
	modules map[string]*FOMModule
}

// NewFOMModuleCollection creates a new FOM module collection
func NewFOMModuleCollection() *FOMModuleCollection {
	return &FOMModuleCollection{
		modules: make(map[string]*FOMModule),
	}
}

// AddModule adds a module to the collection
func (c *FOMModuleCollection) AddModule(name string, module *FOMModule) {
	c.modules[name] = module
}

// GetModule retrieves a module by name
func (c *FOMModuleCollection) GetModule(name string) *FOMModule {
	return c.modules[name]
}

// MergeAll merges all modules in the collection
func (c *FOMModuleCollection) MergeAll() *FOMModule {
	mods := make([]*FOMModule, 0, len(c.modules))
	for _, m := range c.modules {
		mods = append(mods, m)
	}
	return MergeModules(mods)
}

// ResolveInheritance resolves object class inheritance
func (m *FOMModule) ResolveInheritance() error {
	classMap := make(map[string]*ObjectClass)
	for i := range m.ObjectClasses {
		classMap[m.ObjectClasses[i].FullName] = &m.ObjectClasses[i]
	}

	for i := range m.ObjectClasses {
		oc := &m.ObjectClasses[i]
		if oc.Parent != "" {
			parent, ok := classMap[oc.Parent]
			if ok {
				// Inherit attributes from parent
				parentAttrs := make(map[string]bool)
				for _, attr := range parent.Attributes {
					parentAttrs[attr.Name] = true
				}
				// Add parent's attributes that aren't overridden
				for _, attr := range parent.Attributes {
					if !parentAttrs[attr.Name] {
						oc.Attributes = append(oc.Attributes, attr)
					}
				}
			}
		}
	}

	return nil
}

// GetAllAttributes returns all attributes of a class including inherited ones
func (oc *ObjectClass) GetAllAttributes(m *FOMModule) []Attribute {
	attrs := make([]Attribute, 0)
	seen := make(map[string]bool)

	// Walk up the inheritance chain
	current := oc
	for current != nil {
		for _, attr := range current.Attributes {
			if !seen[attr.Name] {
				attrs = append(attrs, attr)
				seen[attr.Name] = true
			}
		}
		if current.Parent == "" {
			break
		}
		parent := m.GetObjectClass(current.Parent)
		if parent == nil {
			break
		}
		current = parent
	}

	return attrs
}