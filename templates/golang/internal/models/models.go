// Package models provides standardized data structures for GTM analysis modules.
//
// This template provides standardized data models for GTM analysis results.
// These models ensure consistency across all analysis modules and provide
// type safety for Go implementations.
//
// Template placeholders:
// - {MODULE_NAME}: Module name for analyzer structs

package models

import (
	"time"
)

// TestIssue represents a standardized issue found during analysis
type TestIssue struct {
	Type           string                 `json:"type"`
	Severity       string                 `json:"severity"`
	Element        map[string]interface{} `json:"element"`
	Message        string                 `json:"message"`
	Recommendation string                 `json:"recommendation"`
	Module         string                 `json:"module"`
	DetectedAt     time.Time              `json:"detected_at"`
}

// ModuleResult represents standardized result from analysis modules
type ModuleResult struct {
	Module       string                 `json:"module"`
	Status       string                 `json:"status"`
	Issues       []TestIssue            `json:"issues"`
	Summary      map[string]interface{} `json:"summary"`
	ErrorMessage string                 `json:"error_message,omitempty"`
	StartedAt    time.Time              `json:"started_at"`
	CompletedAt  time.Time              `json:"completed_at"`
}

// AnalysisData represents the input data structure for {MODULE_NAME} analysis
type AnalysisData struct {
	// TODO: Customize based on your specific analysis requirements
	// This is a template - modify fields according to your needs
	
	// Common GTM element structures:
	// Tags      []TagData      `json:"tags,omitempty"`
	// Triggers  []TriggerData  `json:"triggers,omitempty"`
	// Variables []VariableData `json:"variables,omitempty"`
	// Folders   []FolderData   `json:"folders,omitempty"`
	
	// Analysis-specific options:
	// Options   *AnalysisOptions `json:"options,omitempty"`
}

// AnalysisOptions configures analysis behavior
type AnalysisOptions struct {
	IncludeLowSeverity  bool     `json:"include_low_severity,omitempty"`
	DetailedReporting   bool     `json:"detailed_reporting,omitempty"`
	MaxIssuesPerModule  int      `json:"max_issues_per_module,omitempty"`
	ExcludeIssueTypes   []string `json:"exclude_issue_types,omitempty"`
}

// Example GTM element structures - customize based on your module needs
type TagData struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Type           string `json:"type"`
	Notes          string `json:"notes,omitempty"`
	ParentFolderID string `json:"parent_folder_id,omitempty"`
	// Add more fields as needed for your analysis
}

type TriggerData struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Type           string `json:"type"`
	Notes          string `json:"notes,omitempty"`
	ParentFolderID string `json:"parent_folder_id,omitempty"`
	// Add more fields as needed for your analysis
}

type VariableData struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Type           string `json:"type"`
	Notes          string `json:"notes,omitempty"`
	ParentFolderID string `json:"parent_folder_id,omitempty"`
	// Add more fields as needed for your analysis
}

type FolderData struct {
	FolderID string `json:"folder_id"`
	Name     string `json:"name"`
}

// Severity levels
const (
	SeverityCritical = "critical"
	SeverityHigh     = "high" 
	SeverityMedium   = "medium"
	SeverityLow      = "low"
)

// Status levels
const (
	StatusSuccess = "success"
	StatusError   = "error"
	StatusPartial = "partial"
)

// Helper functions for issue creation

// NewTestIssue creates a new TestIssue instance
func NewTestIssue(issueType, severity string, element map[string]interface{}, message, recommendation, module string) TestIssue {
	return TestIssue{
		Type:           issueType,
		Severity:       severity,
		Element:        element,
		Message:        message,
		Recommendation: recommendation,
		Module:         module,
		DetectedAt:     time.Now(),
	}
}

// NewSuccessResult creates a successful ModuleResult instance
func NewSuccessResult(issues []TestIssue, module string, additionalSummary map[string]interface{}) ModuleResult {
	summary := map[string]interface{}{
		"total_issues": len(issues),
		"critical":     CountIssuesBySeverity(issues, SeverityCritical),
		"high":         CountIssuesBySeverity(issues, SeverityHigh),
		"medium":       CountIssuesBySeverity(issues, SeverityMedium),
		"low":          CountIssuesBySeverity(issues, SeverityLow),
	}
	
	// Add additional summary data
	for k, v := range additionalSummary {
		summary[k] = v
	}
	
	return ModuleResult{
		Module:      module,
		Status:      StatusSuccess,
		Issues:      issues,
		Summary:     summary,
		StartedAt:   time.Now(),
		CompletedAt: time.Now(),
	}
}

// NewErrorResult creates an error ModuleResult instance
func NewErrorResult(errorMessage, module string) ModuleResult {
	return ModuleResult{
		Module:       module,
		Status:       StatusError,
		Issues:       []TestIssue{},
		Summary:      map[string]interface{}{"error": errorMessage},
		ErrorMessage: errorMessage,
		StartedAt:    time.Now(),
		CompletedAt:  time.Now(),
	}
}

// Utility functions

// CountIssuesBySeverity counts issues by severity level
func CountIssuesBySeverity(issues []TestIssue, severity string) int {
	count := 0
	for _, issue := range issues {
		if issue.Severity == severity {
			count++
		}
	}
	return count
}

// GetSeverityWeight returns numeric weight for severity comparison
func GetSeverityWeight(severity string) int {
	weights := map[string]int{
		SeverityLow:      1,
		SeverityMedium:   2,
		SeverityHigh:     3,
		SeverityCritical: 4,
	}
	if weight, exists := weights[severity]; exists {
		return weight
	}
	return 0
}

// ValidateSeverity checks if severity is valid
func ValidateSeverity(severity string) bool {
	validSeverities := []string{SeverityCritical, SeverityHigh, SeverityMedium, SeverityLow}
	for _, valid := range validSeverities {
		if severity == valid {
			return true
		}
	}
	return false
}

// ValidateStatus checks if status is valid
func ValidateStatus(status string) bool {
	validStatuses := []string{StatusSuccess, StatusError, StatusPartial}
	for _, valid := range validStatuses {
		if status == valid {
			return true
		}
	}
	return false
}

// FilterIssuesBySeverity filters issues by minimum severity level
func FilterIssuesBySeverity(issues []TestIssue, minSeverity string) []TestIssue {
	minWeight := GetSeverityWeight(minSeverity)
	var filtered []TestIssue
	
	for _, issue := range issues {
		if GetSeverityWeight(issue.Severity) >= minWeight {
			filtered = append(filtered, issue)
		}
	}
	
	return filtered
}

// SortIssuesBySeverity sorts issues by severity (highest first)
func SortIssuesBySeverity(issues []TestIssue) []TestIssue {
	sorted := make([]TestIssue, len(issues))
	copy(sorted, issues)
	
	for i := 0; i < len(sorted)-1; i++ {
		for j := i + 1; j < len(sorted); j++ {
			if GetSeverityWeight(sorted[j].Severity) > GetSeverityWeight(sorted[i].Severity) {
				sorted[i], sorted[j] = sorted[j], sorted[i]
			}
		}
	}
	
	return sorted
}