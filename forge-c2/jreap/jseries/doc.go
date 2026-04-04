// Package jseries implements Link 16 J-series message packing and unpacking
// per MIL-STD-6016 and related specifications.
//
// Link 16 uses packed binary formats with fields at bit-level granularity.
// This package provides utilities for packing Go values into tightly-packed
// byte buffers and unpacking them back out, matching the bit layouts defined
// in the MIL-STD-6016 message specifications.
//
// Packing is used to convert in-memory Go structs into the wire-format byte
// sequences that JREAP-C encapsulates. Unpacking does the reverse.
//
// Field ordering within each message follows the applicable MIL-STD-6016
// notification order. Padding bits may be inserted to achieve byte alignment
// where required by the specification.
package jseries
