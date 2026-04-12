package hla

import (
	"encoding/xml"
	"fmt"
	"io"
	"strings"
)

type FOMModule struct {
	Name               string
	Version            string
	ObjectClasses      []ObjectClass
	InteractionClasses []InteractionClass
	Datatypes          []DatatypeDefinition
}

type ObjectClass struct {
	Name       string
	FullName   string
	Parent     string
	Attributes []Attribute
}

type InteractionClass struct {
	Name       string
	FullName   string
	Parent     string
	Parameters []Parameter
}

type Attribute struct {
	Name     string
	Datatype string
}

type Parameter struct {
	Name     string
	Datatype string
}

type DatatypeDefinition struct {
	Name      string
	Kind      DatatypeKind
	BaseType  string
	Enumerals []Enumeral
}

type DatatypeKind int

const (
	DatatypeSimple DatatypeKind = iota
	DatatypeEnumerated
	DatatypeArray
	DatatypeRecord
)

type Enumeral struct {
	Name  string
	Value int
}

type FOMParser struct {
	module *FOMModule
}

func NewFOMParser() *FOMParser {
	return &FOMParser{}
}

// getAttr does case-insensitive attribute lookup
func getAttr(attrs []xml.Attr, name string) string {
	lowerName := strings.ToLower(name)
	for _, a := range attrs {
		if strings.ToLower(a.Name.Local) == lowerName {
			return a.Value
		}
	}
	return ""
}

func extractName(fullName string) string {
	parts := strings.Split(fullName, ".")
	if len(parts) > 0 {
		return parts[len(parts)-1]
	}
	return fullName
}

func (p *FOMParser) Parse(xmlContent []byte) (*FOMModule, error) {
	p.module = &FOMModule{
		ObjectClasses:      make([]ObjectClass, 0),
		InteractionClasses: make([]InteractionClass, 0),
		Datatypes:          make([]DatatypeDefinition, 0),
	}

	decoder := xml.NewDecoder(strings.NewReader(string(xmlContent)))
	var objectStack []ObjectClass
	var interactionStack []InteractionClass

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		switch elem := token.(type) {
		case xml.StartElement:
			switch elem.Name.Local {
			case "objectClass":
				name := getAttr(elem.Attr, "Name")
				obj := ObjectClass{
					Name:       extractName(name),
					FullName:   name,
					Attributes: make([]Attribute, 0),
				}
				objectStack = append(objectStack, obj)

			case "interactionClass":
				name := getAttr(elem.Attr, "Name")
				ic := InteractionClass{
					Name:       extractName(name),
					FullName:   name,
					Parameters: make([]Parameter, 0),
				}
				interactionStack = append(interactionStack, ic)

			case "attribute":
				if len(objectStack) > 0 {
					obj := &objectStack[len(objectStack)-1]
					obj.Attributes = append(obj.Attributes, Attribute{
						Name:     getAttr(elem.Attr, "Name"),
						Datatype: getAttr(elem.Attr, "DataType"),
					})
				}

			case "parameter":
				if len(interactionStack) > 0 {
					ic := &interactionStack[len(interactionStack)-1]
					ic.Parameters = append(ic.Parameters, Parameter{
						Name:     getAttr(elem.Attr, "Name"),
						Datatype: getAttr(elem.Attr, "DataType"),
					})
				}
			}

		case xml.EndElement:
			switch elem.Name.Local {
			case "objectClass":
				if len(objectStack) > 0 {
					obj := objectStack[len(objectStack)-1]
					objectStack = objectStack[:len(objectStack)-1]
					p.module.ObjectClasses = append(p.module.ObjectClasses, obj)
				}
			case "interactionClass":
				if len(interactionStack) > 0 {
					ic := interactionStack[len(interactionStack)-1]
					interactionStack = interactionStack[:len(interactionStack)-1]
					p.module.InteractionClasses = append(p.module.InteractionClasses, ic)
				}
			}
		}
	}

	return p.module, nil
}

func (m *FOMModule) GetObjectClass(name string) *ObjectClass {
	for i := range m.ObjectClasses {
		if m.ObjectClasses[i].Name == name || m.ObjectClasses[i].FullName == name {
			return &m.ObjectClasses[i]
		}
	}
	return nil
}

func (m *FOMModule) GetInteractionClass(name string) *InteractionClass {
	for i := range m.InteractionClasses {
		if m.InteractionClasses[i].Name == name || m.InteractionClasses[i].FullName == name {
			return &m.InteractionClasses[i]
		}
	}
	return nil
}

func (m *FOMModule) String() string {
	return fmt.Sprintf("FOM: Objects:%d, Interactions:%d, Datatypes:%d",
		len(m.ObjectClasses), len(m.InteractionClasses), len(m.Datatypes))
}
