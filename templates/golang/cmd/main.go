// GTM {MODULE_NAME} Analysis gRPC Server
//
// This template provides a complete gRPC server implementation for GTM analysis modules in Go.
// Replace placeholders with your specific module implementation details.
//
// Template placeholders:
// - {MODULE_NAME}: Module name (e.g., "associations", "javascript", "security")
// - {SERVICE_NAME}: Service struct name (e.g., "JavascriptAnalysisService")
// - {ANALYZER_STRUCT}: Analyzer struct name (e.g., "JavascriptAnalyzer")
// - {PORT}: gRPC server port (e.g., 50051, 50052, 50053, 50054)

package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/health"
	"google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/grpc/reflection"

	// Import generated protobuf files
	// TODO: Update import path to match your generated Go protobuf files
	pb "github.com/monks-sentinel/gtm-proto/analysis/v1"
	
	// Import internal packages
	"{MODULE_NAME}analyzer"
	"models"
)

// {SERVICE_NAME}Server implements the gRPC service for {MODULE_NAME} analysis
type {SERVICE_NAME}Server struct {
	pb.Unimplemented{SERVICE_NAME}Server
}

// Analyze{MODULE_NAME} handles gRPC requests for {MODULE_NAME} analysis
func (s *{SERVICE_NAME}Server) Analyze{MODULE_NAME}(ctx context.Context, req *pb.{MODULE_NAME}AnalysisRequest) (*pb.ModuleResult, error) {
	log.Printf("Received {MODULE_NAME} analysis request: %s", req.GetRequestId())
	
	// Convert gRPC request to internal data structure
	data, err := convertProtobufToInternal(req)
	if err != nil {
		log.Printf("Error converting protobuf request: %v", err)
		return createErrorResult("Failed to parse request data", err.Error()), nil
	}
	
	// Initialize analyzer with converted data
	analyzer := {MODULE_NAME}analyzer.New{ANALYZER_STRUCT}(data)
	
	// Run analysis
	issues, err := analyzer.AnalyzeAll()
	if err != nil {
		log.Printf("Analysis error: %v", err)
		return createErrorResult("Analysis failed", err.Error()), nil
	}
	
	log.Printf("Analysis completed: found %d issues", len(issues))
	
	// Convert results to protobuf response
	return convertResultToProtobuf(issues), nil
}

// CheckHealth implements the health check service
func (s *{SERVICE_NAME}Server) CheckHealth(ctx context.Context, req *pb.HealthRequest) (*pb.HealthResponse, error) {
	log.Println("Health check requested")
	
	response := &pb.HealthResponse{
		Status:  pb.HealthResponse_SERVING,
		Message: "{MODULE_NAME} Analysis Service is healthy",
		Metadata: map[string]string{
			"service": "gtm-{MODULE_NAME}-analyzer",
			"version": "1.0.0",
			"module":  "{MODULE_NAME}",
		},
		Timestamp: timestampNow(),
	}
	
	return response, nil
}

// convertProtobufToInternal converts gRPC request to internal data structure
func convertProtobufToInternal(req *pb.{MODULE_NAME}AnalysisRequest) (*models.AnalysisData, error) {
	// TODO: Customize this conversion based on your specific protobuf request structure
	// This is a template - modify according to your {MODULE_NAME}AnalysisRequest fields
	
	data := &models.AnalysisData{
		// Example conversions - replace with your actual fields:
		// Tags:      convertTags(req.GetTags()),
		// Triggers:  convertTriggers(req.GetTriggers()),
		// Variables: convertVariables(req.GetVariables()),
	}
	
	return data, nil
}

// convertResultToProtobuf converts analysis results to protobuf response
func convertResultToProtobuf(issues []models.TestIssue) *pb.ModuleResult {
	pbIssues := make([]*pb.TestIssue, len(issues))
	
	for i, issue := range issues {
		pbIssue := &pb.TestIssue{
			Type:           issue.Type,
			Message:        issue.Message,
			Recommendation: issue.Recommendation,
			Module:         "{MODULE_NAME}",
			Element:        make(map[string]string),
			DetectedAt:     timestampNow(),
		}
		
		// Set severity
		switch issue.Severity {
		case "critical":
			pbIssue.Severity = pb.TestIssue_CRITICAL
		case "high":
			pbIssue.Severity = pb.TestIssue_HIGH
		case "medium":
			pbIssue.Severity = pb.TestIssue_MEDIUM
		case "low":
			pbIssue.Severity = pb.TestIssue_LOW
		default:
			pbIssue.Severity = pb.TestIssue_SEVERITY_UNSPECIFIED
		}
		
		// Convert element map
		for k, v := range issue.Element {
			pbIssue.Element[k] = fmt.Sprintf("%v", v)
		}
		
		pbIssues[i] = pbIssue
	}
	
	// Calculate summary statistics
	summary := make(map[string]int32)
	summary["total_issues"] = int32(len(issues))
	summary["critical"] = countIssuesBySeverity(issues, "critical")
	summary["high"] = countIssuesBySeverity(issues, "high")
	summary["medium"] = countIssuesBySeverity(issues, "medium")
	summary["low"] = countIssuesBySeverity(issues, "low")
	
	result := &pb.ModuleResult{
		Module:      "{MODULE_NAME}",
		Status:      pb.ModuleResult_SUCCESS,
		Issues:      pbIssues,
		Summary:     summary,
		StartedAt:   timestampNow(),
		CompletedAt: timestampNow(),
	}
	
	return result
}

// createErrorResult creates an error response
func createErrorResult(message, errorMessage string) *pb.ModuleResult {
	summary := make(map[string]int32)
	summary["total_errors"] = 1
	
	return &pb.ModuleResult{
		Module:       "{MODULE_NAME}",
		Status:       pb.ModuleResult_ERROR,
		Issues:       []*pb.TestIssue{},
		Summary:      summary,
		ErrorMessage: fmt.Sprintf("%s: %s", message, errorMessage),
		StartedAt:    timestampNow(),
		CompletedAt:  timestampNow(),
	}
}

// Helper functions

func countIssuesBySeverity(issues []models.TestIssue, severity string) int32 {
	count := int32(0)
	for _, issue := range issues {
		if issue.Severity == severity {
			count++
		}
	}
	return count
}

func timestampNow() *timestamppb.Timestamp {
	return timestamppb.New(time.Now())
}

// Server setup and main function

func main() {
	// Parse command line flags or environment variables
	port := os.Getenv("PORT")
	if port == "" {
		port = "{PORT}"
	}
	
	host := os.Getenv("HOST")
	if host == "" {
		host = "0.0.0.0"
	}
	
	address := fmt.Sprintf("%s:%s", host, port)
	
	// Create TCP listener
	lis, err := net.Listen("tcp", address)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	
	// Create gRPC server with options
	s := grpc.NewServer(
		grpc.KeepaliveParams(keepalive.ServerParameters{
			Time:              30 * time.Second,
			Timeout:           10 * time.Second,
			MaxConnectionIdle: 5 * time.Minute,
		}),
		grpc.KeepaliveEnforcementPolicy(keepalive.EnforcementPolicy{
			MinTime:             10 * time.Second,
			PermitWithoutStream: true,
		}),
	)
	
	// Register services
	{MODULE_NAME}Service := &{SERVICE_NAME}Server{}
	pb.Register{SERVICE_NAME}Server(s, {MODULE_NAME}Service)
	
	// Register health service
	healthServer := health.NewServer()
	healthServer.SetServingStatus("gtm.analysis.v1.{SERVICE_NAME}", grpc_health_v1.HealthCheckResponse_SERVING)
	healthServer.SetServingStatus("", grpc_health_v1.HealthCheckResponse_SERVING)
	grpc_health_v1.RegisterHealthServer(s, healthServer)
	
	// Register reflection service (optional, for debugging)
	reflection.Register(s)
	
	// Start server in a goroutine
	go func() {
		log.Printf("GTM {MODULE_NAME} Analyzer gRPC server listening on %s", address)
		if err := s.Serve(lis); err != nil {
			log.Fatalf("Failed to serve: %v", err)
		}
	}()
	
	// Wait for interrupt signal to gracefully shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	
	log.Println("Shutting down gRPC server...")
	
	// Graceful shutdown with timeout
	done := make(chan struct{})
	go func() {
		s.GracefulStop()
		close(done)
	}()
	
	select {
	case <-done:
		log.Println("gRPC server stopped gracefully")
	case <-time.After(10 * time.Second):
		log.Println("Force stopping gRPC server")
		s.Stop()
	}
}