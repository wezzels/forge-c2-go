{{/*
Expand the name of the chart.
*/}}
{{- define "forge-c2.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "forge-c2.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "forge-c2.labels" -}}
{{- include "forge-c2.name" . }}
heritage: {{ .Release.Service }}
release: {{ .Release.Name }}
chart: {{ .Chart.Name }}
version: {{ .Chart.Version }}
{{- end }}

{{- define "forge-c2.selectorLabels" -}}
app: {{ include "forge-c2.name" . }}
release: {{ .Release.Name }}
{{- end }}
