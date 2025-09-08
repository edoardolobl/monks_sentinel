// package: gtm.analysis.v1
// file: gtm_analysis.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as gtm_analysis_pb from "./gtm_analysis_pb";
import * as gtm_models_pb from "./gtm_models_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IGTMAnalysisServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    analyzeContainer: IGTMAnalysisServiceService_IAnalyzeContainer;
    uploadAndAnalyze: IGTMAnalysisServiceService_IUploadAndAnalyze;
    analyzeContainerStreaming: IGTMAnalysisServiceService_IAnalyzeContainerStreaming;
    getAnalysisStatus: IGTMAnalysisServiceService_IGetAnalysisStatus;
    checkHealth: IGTMAnalysisServiceService_ICheckHealth;
    listModules: IGTMAnalysisServiceService_IListModules;
}

interface IGTMAnalysisServiceService_IAnalyzeContainer extends grpc.MethodDefinition<gtm_analysis_pb.AnalysisRequest, gtm_analysis_pb.AnalysisResponse> {
    path: "/gtm.analysis.v1.GTMAnalysisService/AnalyzeContainer";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.AnalysisResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.AnalysisResponse>;
}
interface IGTMAnalysisServiceService_IUploadAndAnalyze extends grpc.MethodDefinition<gtm_analysis_pb.FileUploadRequest, gtm_analysis_pb.AnalysisResponse> {
    path: "/gtm.analysis.v1.GTMAnalysisService/UploadAndAnalyze";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.FileUploadRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.FileUploadRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.AnalysisResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.AnalysisResponse>;
}
interface IGTMAnalysisServiceService_IAnalyzeContainerStreaming extends grpc.MethodDefinition<gtm_analysis_pb.AnalysisRequest, gtm_analysis_pb.ModuleResult> {
    path: "/gtm.analysis.v1.GTMAnalysisService/AnalyzeContainerStreaming";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<gtm_analysis_pb.AnalysisRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.AnalysisRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.ModuleResult>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.ModuleResult>;
}
interface IGTMAnalysisServiceService_IGetAnalysisStatus extends grpc.MethodDefinition<gtm_analysis_pb.AnalysisStatusRequest, gtm_analysis_pb.AnalysisResponse> {
    path: "/gtm.analysis.v1.GTMAnalysisService/GetAnalysisStatus";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.AnalysisStatusRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.AnalysisStatusRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.AnalysisResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.AnalysisResponse>;
}
interface IGTMAnalysisServiceService_ICheckHealth extends grpc.MethodDefinition<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse> {
    path: "/gtm.analysis.v1.GTMAnalysisService/CheckHealth";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.HealthRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.HealthRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.HealthResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.HealthResponse>;
}
interface IGTMAnalysisServiceService_IListModules extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, gtm_analysis_pb.ListModulesResponse> {
    path: "/gtm.analysis.v1.GTMAnalysisService/ListModules";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.ListModulesResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.ListModulesResponse>;
}

export const GTMAnalysisServiceService: IGTMAnalysisServiceService;

export interface IGTMAnalysisServiceServer extends grpc.UntypedServiceImplementation {
    analyzeContainer: grpc.handleUnaryCall<gtm_analysis_pb.AnalysisRequest, gtm_analysis_pb.AnalysisResponse>;
    uploadAndAnalyze: grpc.handleClientStreamingCall<gtm_analysis_pb.FileUploadRequest, gtm_analysis_pb.AnalysisResponse>;
    analyzeContainerStreaming: grpc.handleServerStreamingCall<gtm_analysis_pb.AnalysisRequest, gtm_analysis_pb.ModuleResult>;
    getAnalysisStatus: grpc.handleUnaryCall<gtm_analysis_pb.AnalysisStatusRequest, gtm_analysis_pb.AnalysisResponse>;
    checkHealth: grpc.handleUnaryCall<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse>;
    listModules: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, gtm_analysis_pb.ListModulesResponse>;
}

export interface IGTMAnalysisServiceClient {
    analyzeContainer(request: gtm_analysis_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    analyzeContainer(request: gtm_analysis_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    analyzeContainer(request: gtm_analysis_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    uploadAndAnalyze(callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientWritableStream<gtm_analysis_pb.FileUploadRequest>;
    uploadAndAnalyze(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientWritableStream<gtm_analysis_pb.FileUploadRequest>;
    uploadAndAnalyze(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientWritableStream<gtm_analysis_pb.FileUploadRequest>;
    uploadAndAnalyze(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientWritableStream<gtm_analysis_pb.FileUploadRequest>;
    analyzeContainerStreaming(request: gtm_analysis_pb.AnalysisRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<gtm_analysis_pb.ModuleResult>;
    analyzeContainerStreaming(request: gtm_analysis_pb.AnalysisRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<gtm_analysis_pb.ModuleResult>;
    getAnalysisStatus(request: gtm_analysis_pb.AnalysisStatusRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    getAnalysisStatus(request: gtm_analysis_pb.AnalysisStatusRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    getAnalysisStatus(request: gtm_analysis_pb.AnalysisStatusRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    listModules(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ListModulesResponse) => void): grpc.ClientUnaryCall;
    listModules(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ListModulesResponse) => void): grpc.ClientUnaryCall;
    listModules(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ListModulesResponse) => void): grpc.ClientUnaryCall;
}

export class GTMAnalysisServiceClient extends grpc.Client implements IGTMAnalysisServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public analyzeContainer(request: gtm_analysis_pb.AnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    public analyzeContainer(request: gtm_analysis_pb.AnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    public analyzeContainer(request: gtm_analysis_pb.AnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    public uploadAndAnalyze(callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientWritableStream<gtm_analysis_pb.FileUploadRequest>;
    public uploadAndAnalyze(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientWritableStream<gtm_analysis_pb.FileUploadRequest>;
    public uploadAndAnalyze(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientWritableStream<gtm_analysis_pb.FileUploadRequest>;
    public uploadAndAnalyze(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientWritableStream<gtm_analysis_pb.FileUploadRequest>;
    public analyzeContainerStreaming(request: gtm_analysis_pb.AnalysisRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<gtm_analysis_pb.ModuleResult>;
    public analyzeContainerStreaming(request: gtm_analysis_pb.AnalysisRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<gtm_analysis_pb.ModuleResult>;
    public getAnalysisStatus(request: gtm_analysis_pb.AnalysisStatusRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    public getAnalysisStatus(request: gtm_analysis_pb.AnalysisStatusRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    public getAnalysisStatus(request: gtm_analysis_pb.AnalysisStatusRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.AnalysisResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public listModules(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ListModulesResponse) => void): grpc.ClientUnaryCall;
    public listModules(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ListModulesResponse) => void): grpc.ClientUnaryCall;
    public listModules(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ListModulesResponse) => void): grpc.ClientUnaryCall;
}

interface IAssociationsAnalysisServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    analyzeAssociations: IAssociationsAnalysisServiceService_IAnalyzeAssociations;
    checkHealth: IAssociationsAnalysisServiceService_ICheckHealth;
}

interface IAssociationsAnalysisServiceService_IAnalyzeAssociations extends grpc.MethodDefinition<gtm_analysis_pb.AssociationsAnalysisRequest, gtm_analysis_pb.ModuleResult> {
    path: "/gtm.analysis.v1.AssociationsAnalysisService/AnalyzeAssociations";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.AssociationsAnalysisRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.AssociationsAnalysisRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.ModuleResult>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.ModuleResult>;
}
interface IAssociationsAnalysisServiceService_ICheckHealth extends grpc.MethodDefinition<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse> {
    path: "/gtm.analysis.v1.AssociationsAnalysisService/CheckHealth";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.HealthRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.HealthRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.HealthResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.HealthResponse>;
}

export const AssociationsAnalysisServiceService: IAssociationsAnalysisServiceService;

export interface IAssociationsAnalysisServiceServer extends grpc.UntypedServiceImplementation {
    analyzeAssociations: grpc.handleUnaryCall<gtm_analysis_pb.AssociationsAnalysisRequest, gtm_analysis_pb.ModuleResult>;
    checkHealth: grpc.handleUnaryCall<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse>;
}

export interface IAssociationsAnalysisServiceClient {
    analyzeAssociations(request: gtm_analysis_pb.AssociationsAnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    analyzeAssociations(request: gtm_analysis_pb.AssociationsAnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    analyzeAssociations(request: gtm_analysis_pb.AssociationsAnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
}

export class AssociationsAnalysisServiceClient extends grpc.Client implements IAssociationsAnalysisServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public analyzeAssociations(request: gtm_analysis_pb.AssociationsAnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public analyzeAssociations(request: gtm_analysis_pb.AssociationsAnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public analyzeAssociations(request: gtm_analysis_pb.AssociationsAnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
}

interface IGovernanceAnalysisServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    analyzeGovernance: IGovernanceAnalysisServiceService_IAnalyzeGovernance;
    checkHealth: IGovernanceAnalysisServiceService_ICheckHealth;
}

interface IGovernanceAnalysisServiceService_IAnalyzeGovernance extends grpc.MethodDefinition<gtm_analysis_pb.GovernanceAnalysisRequest, gtm_analysis_pb.ModuleResult> {
    path: "/gtm.analysis.v1.GovernanceAnalysisService/AnalyzeGovernance";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.GovernanceAnalysisRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.GovernanceAnalysisRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.ModuleResult>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.ModuleResult>;
}
interface IGovernanceAnalysisServiceService_ICheckHealth extends grpc.MethodDefinition<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse> {
    path: "/gtm.analysis.v1.GovernanceAnalysisService/CheckHealth";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.HealthRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.HealthRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.HealthResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.HealthResponse>;
}

export const GovernanceAnalysisServiceService: IGovernanceAnalysisServiceService;

export interface IGovernanceAnalysisServiceServer extends grpc.UntypedServiceImplementation {
    analyzeGovernance: grpc.handleUnaryCall<gtm_analysis_pb.GovernanceAnalysisRequest, gtm_analysis_pb.ModuleResult>;
    checkHealth: grpc.handleUnaryCall<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse>;
}

export interface IGovernanceAnalysisServiceClient {
    analyzeGovernance(request: gtm_analysis_pb.GovernanceAnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    analyzeGovernance(request: gtm_analysis_pb.GovernanceAnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    analyzeGovernance(request: gtm_analysis_pb.GovernanceAnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
}

export class GovernanceAnalysisServiceClient extends grpc.Client implements IGovernanceAnalysisServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public analyzeGovernance(request: gtm_analysis_pb.GovernanceAnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public analyzeGovernance(request: gtm_analysis_pb.GovernanceAnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public analyzeGovernance(request: gtm_analysis_pb.GovernanceAnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
}

interface IJavaScriptAnalysisServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    analyzeJavaScript: IJavaScriptAnalysisServiceService_IAnalyzeJavaScript;
    checkHealth: IJavaScriptAnalysisServiceService_ICheckHealth;
}

interface IJavaScriptAnalysisServiceService_IAnalyzeJavaScript extends grpc.MethodDefinition<gtm_analysis_pb.JavaScriptAnalysisRequest, gtm_analysis_pb.ModuleResult> {
    path: "/gtm.analysis.v1.JavaScriptAnalysisService/AnalyzeJavaScript";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.JavaScriptAnalysisRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.JavaScriptAnalysisRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.ModuleResult>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.ModuleResult>;
}
interface IJavaScriptAnalysisServiceService_ICheckHealth extends grpc.MethodDefinition<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse> {
    path: "/gtm.analysis.v1.JavaScriptAnalysisService/CheckHealth";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.HealthRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.HealthRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.HealthResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.HealthResponse>;
}

export const JavaScriptAnalysisServiceService: IJavaScriptAnalysisServiceService;

export interface IJavaScriptAnalysisServiceServer extends grpc.UntypedServiceImplementation {
    analyzeJavaScript: grpc.handleUnaryCall<gtm_analysis_pb.JavaScriptAnalysisRequest, gtm_analysis_pb.ModuleResult>;
    checkHealth: grpc.handleUnaryCall<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse>;
}

export interface IJavaScriptAnalysisServiceClient {
    analyzeJavaScript(request: gtm_analysis_pb.JavaScriptAnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    analyzeJavaScript(request: gtm_analysis_pb.JavaScriptAnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    analyzeJavaScript(request: gtm_analysis_pb.JavaScriptAnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
}

export class JavaScriptAnalysisServiceClient extends grpc.Client implements IJavaScriptAnalysisServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public analyzeJavaScript(request: gtm_analysis_pb.JavaScriptAnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public analyzeJavaScript(request: gtm_analysis_pb.JavaScriptAnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public analyzeJavaScript(request: gtm_analysis_pb.JavaScriptAnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
}

interface IHTMLAnalysisServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    analyzeHTML: IHTMLAnalysisServiceService_IAnalyzeHTML;
    checkHealth: IHTMLAnalysisServiceService_ICheckHealth;
}

interface IHTMLAnalysisServiceService_IAnalyzeHTML extends grpc.MethodDefinition<gtm_analysis_pb.HTMLAnalysisRequest, gtm_analysis_pb.ModuleResult> {
    path: "/gtm.analysis.v1.HTMLAnalysisService/AnalyzeHTML";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.HTMLAnalysisRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.HTMLAnalysisRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.ModuleResult>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.ModuleResult>;
}
interface IHTMLAnalysisServiceService_ICheckHealth extends grpc.MethodDefinition<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse> {
    path: "/gtm.analysis.v1.HTMLAnalysisService/CheckHealth";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<gtm_analysis_pb.HealthRequest>;
    requestDeserialize: grpc.deserialize<gtm_analysis_pb.HealthRequest>;
    responseSerialize: grpc.serialize<gtm_analysis_pb.HealthResponse>;
    responseDeserialize: grpc.deserialize<gtm_analysis_pb.HealthResponse>;
}

export const HTMLAnalysisServiceService: IHTMLAnalysisServiceService;

export interface IHTMLAnalysisServiceServer extends grpc.UntypedServiceImplementation {
    analyzeHTML: grpc.handleUnaryCall<gtm_analysis_pb.HTMLAnalysisRequest, gtm_analysis_pb.ModuleResult>;
    checkHealth: grpc.handleUnaryCall<gtm_analysis_pb.HealthRequest, gtm_analysis_pb.HealthResponse>;
}

export interface IHTMLAnalysisServiceClient {
    analyzeHTML(request: gtm_analysis_pb.HTMLAnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    analyzeHTML(request: gtm_analysis_pb.HTMLAnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    analyzeHTML(request: gtm_analysis_pb.HTMLAnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
}

export class HTMLAnalysisServiceClient extends grpc.Client implements IHTMLAnalysisServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public analyzeHTML(request: gtm_analysis_pb.HTMLAnalysisRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public analyzeHTML(request: gtm_analysis_pb.HTMLAnalysisRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public analyzeHTML(request: gtm_analysis_pb.HTMLAnalysisRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.ModuleResult) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
    public checkHealth(request: gtm_analysis_pb.HealthRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: gtm_analysis_pb.HealthResponse) => void): grpc.ClientUnaryCall;
}
