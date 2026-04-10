// Package mdpa implements the FORGE Missile Defense Processing Framework (MDPAF)
// data model and its mapping to Link 16 J-series message types.
//
// MDPAF is the processing architecture used by FORGE to ingest, process, and
// disseminate missile defense track and engagement data. It provides:
//
//   - Standard metadata fields attached to every processed message
//   - FORGE-specific extensions to standard track data (OPIR, IR intensity, etc.)
//   - A stable mapping from FORGE message types to J-series message numbers
//
// Data Model Overview
//
// MDPAF processes several categories of tactical data:
//
//   - OPIR Processing: Raw satellite data from SBIRS/NextGen OPIR
//   - Track Management: Track initiation, update, fusion, and dropout
//   - Engagement Management: Orders, status, and coordination
//   - Alert Dissemination: Launch warnings, threat confirmations
//   - Network Management: Link status, sensor registration
//
// Classification
//
// All MDPAF messages carry a classification marking. Typical values:
//   - "UNCLASSIFIED"
//   - "CONFIDENTIAL//NOFORN"
//   - "SECRET//NOFORN"
//   - "TOP SECRET//SI//NOFORN"
//
// References
//   - FORGE MDPAF Specification (contracted)
//   - MIL-STD-3011 (JREAP-C) - See contracting officer
//   - MIL-STD-6016 (Link 16 J-series)
package mdpa
