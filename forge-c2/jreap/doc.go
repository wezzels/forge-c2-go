// Package jreap implements MIL-STD-3011 JREAP-C encoding and decoding.
//
// JREAP-C (Joint Range Extension Application Protocol - C) encapsulates
// Link 16 tactical data link messages for transmission over IP networks
// (UDP or TCP). This package provides a structurally compliant implementation
// suitable for simulation and testing.
//
// JREAP is documented in:
//   - MIL-STD-3011 (JREAP) - Classified, see contracting officer
//   - STANAG 5518 (NATO JREAP Interoperability Standard)
//
// This package targets JREAP-C specifically, which uses IP/UDP or IP/TCP
// as the underlying transport.
//
// Message Structure (JREAP-C over IP):
//   +----------+----------+--------+----------+------------+------+
//   | Protocol | Message  | Msg    | Reserved | J-Series   | CRC- |
//   | Flags    | Type     | Length |          | Payload    | 16   |
//   | (2 oct) | (1 oct)  | (4 oct)| (1 oct)  | (variable) | (2)  |
//   +----------+----------+--------+----------+------------+------+
//
// The J-Series payload consists of packed binary data as defined in
// the relevant Link 16 message specifications (MIL-STD-6016 series).
package jreap
