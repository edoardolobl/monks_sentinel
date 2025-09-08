// package: gtm.analysis.v1
// file: gtm_analysis.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as gtm_models_pb from "./gtm_models_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class TestIssue extends jspb.Message { 
    getType(): string;
    setType(value: string): TestIssue;
    getSeverity(): TestIssue.Severity;
    setSeverity(value: TestIssue.Severity): TestIssue;

    getElementMap(): jspb.Map<string, string>;
    clearElementMap(): void;
    getMessage(): string;
    setMessage(value: string): TestIssue;
    getRecommendation(): string;
    setRecommendation(value: string): TestIssue;
    getModule(): string;
    setModule(value: string): TestIssue;

    hasDetectedAt(): boolean;
    clearDetectedAt(): void;
    getDetectedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setDetectedAt(value?: google_protobuf_timestamp_pb.Timestamp): TestIssue;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TestIssue.AsObject;
    static toObject(includeInstance: boolean, msg: TestIssue): TestIssue.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TestIssue, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TestIssue;
    static deserializeBinaryFromReader(message: TestIssue, reader: jspb.BinaryReader): TestIssue;
}

export namespace TestIssue {
    export type AsObject = {
        type: string,
        severity: TestIssue.Severity,

        elementMap: Array<[string, string]>,
        message: string,
        recommendation: string,
        module: string,
        detectedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }

    export enum Severity {
    SEVERITY_UNSPECIFIED = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    CRITICAL = 4,
    }

}

export class ModuleResult extends jspb.Message { 
    getModule(): string;
    setModule(value: string): ModuleResult;
    getStatus(): ModuleResult.Status;
    setStatus(value: ModuleResult.Status): ModuleResult;
    clearIssuesList(): void;
    getIssuesList(): Array<TestIssue>;
    setIssuesList(value: Array<TestIssue>): ModuleResult;
    addIssues(value?: TestIssue, index?: number): TestIssue;

    getSummaryMap(): jspb.Map<string, number>;
    clearSummaryMap(): void;
    getErrorMessage(): string;
    setErrorMessage(value: string): ModuleResult;

    hasStartedAt(): boolean;
    clearStartedAt(): void;
    getStartedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setStartedAt(value?: google_protobuf_timestamp_pb.Timestamp): ModuleResult;

    hasCompletedAt(): boolean;
    clearCompletedAt(): void;
    getCompletedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCompletedAt(value?: google_protobuf_timestamp_pb.Timestamp): ModuleResult;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ModuleResult.AsObject;
    static toObject(includeInstance: boolean, msg: ModuleResult): ModuleResult.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ModuleResult, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ModuleResult;
    static deserializeBinaryFromReader(message: ModuleResult, reader: jspb.BinaryReader): ModuleResult;
}

export namespace ModuleResult {
    export type AsObject = {
        module: string,
        status: ModuleResult.Status,
        issuesList: Array<TestIssue.AsObject>,

        summaryMap: Array<[string, number]>,
        errorMessage: string,
        startedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }

    export enum Status {
    STATUS_UNSPECIFIED = 0,
    SUCCESS = 1,
    ERROR = 2,
    PARTIAL = 3,
    }

}

export class AnalysisRequest extends jspb.Message { 
    getRequestId(): string;
    setRequestId(value: string): AnalysisRequest;

    hasGtmContainer(): boolean;
    clearGtmContainer(): void;
    getGtmContainer(): gtm_models_pb.GTMContainer | undefined;
    setGtmContainer(value?: gtm_models_pb.GTMContainer): AnalysisRequest;
    clearModulesList(): void;
    getModulesList(): Array<string>;
    setModulesList(value: Array<string>): AnalysisRequest;
    addModules(value: string, index?: number): string;

    hasOptions(): boolean;
    clearOptions(): void;
    getOptions(): AnalysisOptions | undefined;
    setOptions(value?: AnalysisOptions): AnalysisRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AnalysisRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AnalysisRequest): AnalysisRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AnalysisRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AnalysisRequest;
    static deserializeBinaryFromReader(message: AnalysisRequest, reader: jspb.BinaryReader): AnalysisRequest;
}

export namespace AnalysisRequest {
    export type AsObject = {
        requestId: string,
        gtmContainer?: gtm_models_pb.GTMContainer.AsObject,
        modulesList: Array<string>,
        options?: AnalysisOptions.AsObject,
    }
}

export class AnalysisOptions extends jspb.Message { 
    getIncludeLowSeverity(): boolean;
    setIncludeLowSeverity(value: boolean): AnalysisOptions;
    getDetailedReporting(): boolean;
    setDetailedReporting(value: boolean): AnalysisOptions;
    getMaxIssuesPerModule(): number;
    setMaxIssuesPerModule(value: number): AnalysisOptions;
    clearExcludeIssueTypesList(): void;
    getExcludeIssueTypesList(): Array<string>;
    setExcludeIssueTypesList(value: Array<string>): AnalysisOptions;
    addExcludeIssueTypes(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AnalysisOptions.AsObject;
    static toObject(includeInstance: boolean, msg: AnalysisOptions): AnalysisOptions.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AnalysisOptions, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AnalysisOptions;
    static deserializeBinaryFromReader(message: AnalysisOptions, reader: jspb.BinaryReader): AnalysisOptions;
}

export namespace AnalysisOptions {
    export type AsObject = {
        includeLowSeverity: boolean,
        detailedReporting: boolean,
        maxIssuesPerModule: number,
        excludeIssueTypesList: Array<string>,
    }
}

export class AssociationsAnalysisRequest extends jspb.Message { 
    getRequestId(): string;
    setRequestId(value: string): AssociationsAnalysisRequest;
    clearTagsList(): void;
    getTagsList(): Array<AssociationTag>;
    setTagsList(value: Array<AssociationTag>): AssociationsAnalysisRequest;
    addTags(value?: AssociationTag, index?: number): AssociationTag;
    clearTriggersList(): void;
    getTriggersList(): Array<AssociationTrigger>;
    setTriggersList(value: Array<AssociationTrigger>): AssociationsAnalysisRequest;
    addTriggers(value?: AssociationTrigger, index?: number): AssociationTrigger;
    clearVariablesList(): void;
    getVariablesList(): Array<AssociationVariable>;
    setVariablesList(value: Array<AssociationVariable>): AssociationsAnalysisRequest;
    addVariables(value?: AssociationVariable, index?: number): AssociationVariable;
    clearBuiltinVariablesList(): void;
    getBuiltinVariablesList(): Array<AssociationBuiltInVariable>;
    setBuiltinVariablesList(value: Array<AssociationBuiltInVariable>): AssociationsAnalysisRequest;
    addBuiltinVariables(value?: AssociationBuiltInVariable, index?: number): AssociationBuiltInVariable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AssociationsAnalysisRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AssociationsAnalysisRequest): AssociationsAnalysisRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AssociationsAnalysisRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AssociationsAnalysisRequest;
    static deserializeBinaryFromReader(message: AssociationsAnalysisRequest, reader: jspb.BinaryReader): AssociationsAnalysisRequest;
}

export namespace AssociationsAnalysisRequest {
    export type AsObject = {
        requestId: string,
        tagsList: Array<AssociationTag.AsObject>,
        triggersList: Array<AssociationTrigger.AsObject>,
        variablesList: Array<AssociationVariable.AsObject>,
        builtinVariablesList: Array<AssociationBuiltInVariable.AsObject>,
    }
}

export class AssociationTag extends jspb.Message { 
    getId(): string;
    setId(value: string): AssociationTag;
    getName(): string;
    setName(value: string): AssociationTag;
    getType(): string;
    setType(value: string): AssociationTag;
    clearFiringTriggersList(): void;
    getFiringTriggersList(): Array<string>;
    setFiringTriggersList(value: Array<string>): AssociationTag;
    addFiringTriggers(value: string, index?: number): string;
    clearBlockingTriggersList(): void;
    getBlockingTriggersList(): Array<string>;
    setBlockingTriggersList(value: Array<string>): AssociationTag;
    addBlockingTriggers(value: string, index?: number): string;
    clearVariableReferencesList(): void;
    getVariableReferencesList(): Array<string>;
    setVariableReferencesList(value: Array<string>): AssociationTag;
    addVariableReferences(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AssociationTag.AsObject;
    static toObject(includeInstance: boolean, msg: AssociationTag): AssociationTag.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AssociationTag, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AssociationTag;
    static deserializeBinaryFromReader(message: AssociationTag, reader: jspb.BinaryReader): AssociationTag;
}

export namespace AssociationTag {
    export type AsObject = {
        id: string,
        name: string,
        type: string,
        firingTriggersList: Array<string>,
        blockingTriggersList: Array<string>,
        variableReferencesList: Array<string>,
    }
}

export class AssociationTrigger extends jspb.Message { 
    getId(): string;
    setId(value: string): AssociationTrigger;
    getName(): string;
    setName(value: string): AssociationTrigger;
    getType(): string;
    setType(value: string): AssociationTrigger;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AssociationTrigger.AsObject;
    static toObject(includeInstance: boolean, msg: AssociationTrigger): AssociationTrigger.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AssociationTrigger, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AssociationTrigger;
    static deserializeBinaryFromReader(message: AssociationTrigger, reader: jspb.BinaryReader): AssociationTrigger;
}

export namespace AssociationTrigger {
    export type AsObject = {
        id: string,
        name: string,
        type: string,
    }
}

export class AssociationVariable extends jspb.Message { 
    getId(): string;
    setId(value: string): AssociationVariable;
    getName(): string;
    setName(value: string): AssociationVariable;
    getType(): string;
    setType(value: string): AssociationVariable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AssociationVariable.AsObject;
    static toObject(includeInstance: boolean, msg: AssociationVariable): AssociationVariable.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AssociationVariable, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AssociationVariable;
    static deserializeBinaryFromReader(message: AssociationVariable, reader: jspb.BinaryReader): AssociationVariable;
}

export namespace AssociationVariable {
    export type AsObject = {
        id: string,
        name: string,
        type: string,
    }
}

export class AssociationBuiltInVariable extends jspb.Message { 
    getName(): string;
    setName(value: string): AssociationBuiltInVariable;
    getType(): string;
    setType(value: string): AssociationBuiltInVariable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AssociationBuiltInVariable.AsObject;
    static toObject(includeInstance: boolean, msg: AssociationBuiltInVariable): AssociationBuiltInVariable.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AssociationBuiltInVariable, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AssociationBuiltInVariable;
    static deserializeBinaryFromReader(message: AssociationBuiltInVariable, reader: jspb.BinaryReader): AssociationBuiltInVariable;
}

export namespace AssociationBuiltInVariable {
    export type AsObject = {
        name: string,
        type: string,
    }
}

export class GovernanceAnalysisRequest extends jspb.Message { 
    getRequestId(): string;
    setRequestId(value: string): GovernanceAnalysisRequest;
    clearTagsList(): void;
    getTagsList(): Array<GovernanceTag>;
    setTagsList(value: Array<GovernanceTag>): GovernanceAnalysisRequest;
    addTags(value?: GovernanceTag, index?: number): GovernanceTag;
    clearTriggersList(): void;
    getTriggersList(): Array<GovernanceTrigger>;
    setTriggersList(value: Array<GovernanceTrigger>): GovernanceAnalysisRequest;
    addTriggers(value?: GovernanceTrigger, index?: number): GovernanceTrigger;
    clearVariablesList(): void;
    getVariablesList(): Array<GovernanceVariable>;
    setVariablesList(value: Array<GovernanceVariable>): GovernanceAnalysisRequest;
    addVariables(value?: GovernanceVariable, index?: number): GovernanceVariable;
    clearFoldersList(): void;
    getFoldersList(): Array<GovernanceFolder>;
    setFoldersList(value: Array<GovernanceFolder>): GovernanceAnalysisRequest;
    addFolders(value?: GovernanceFolder, index?: number): GovernanceFolder;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GovernanceAnalysisRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GovernanceAnalysisRequest): GovernanceAnalysisRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GovernanceAnalysisRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GovernanceAnalysisRequest;
    static deserializeBinaryFromReader(message: GovernanceAnalysisRequest, reader: jspb.BinaryReader): GovernanceAnalysisRequest;
}

export namespace GovernanceAnalysisRequest {
    export type AsObject = {
        requestId: string,
        tagsList: Array<GovernanceTag.AsObject>,
        triggersList: Array<GovernanceTrigger.AsObject>,
        variablesList: Array<GovernanceVariable.AsObject>,
        foldersList: Array<GovernanceFolder.AsObject>,
    }
}

export class GovernanceTag extends jspb.Message { 
    getId(): string;
    setId(value: string): GovernanceTag;
    getName(): string;
    setName(value: string): GovernanceTag;
    getType(): string;
    setType(value: string): GovernanceTag;
    getNotes(): string;
    setNotes(value: string): GovernanceTag;
    getParentFolderId(): string;
    setParentFolderId(value: string): GovernanceTag;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GovernanceTag.AsObject;
    static toObject(includeInstance: boolean, msg: GovernanceTag): GovernanceTag.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GovernanceTag, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GovernanceTag;
    static deserializeBinaryFromReader(message: GovernanceTag, reader: jspb.BinaryReader): GovernanceTag;
}

export namespace GovernanceTag {
    export type AsObject = {
        id: string,
        name: string,
        type: string,
        notes: string,
        parentFolderId: string,
    }
}

export class GovernanceTrigger extends jspb.Message { 
    getId(): string;
    setId(value: string): GovernanceTrigger;
    getName(): string;
    setName(value: string): GovernanceTrigger;
    getType(): string;
    setType(value: string): GovernanceTrigger;
    getNotes(): string;
    setNotes(value: string): GovernanceTrigger;
    getParentFolderId(): string;
    setParentFolderId(value: string): GovernanceTrigger;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GovernanceTrigger.AsObject;
    static toObject(includeInstance: boolean, msg: GovernanceTrigger): GovernanceTrigger.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GovernanceTrigger, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GovernanceTrigger;
    static deserializeBinaryFromReader(message: GovernanceTrigger, reader: jspb.BinaryReader): GovernanceTrigger;
}

export namespace GovernanceTrigger {
    export type AsObject = {
        id: string,
        name: string,
        type: string,
        notes: string,
        parentFolderId: string,
    }
}

export class GovernanceVariable extends jspb.Message { 
    getId(): string;
    setId(value: string): GovernanceVariable;
    getName(): string;
    setName(value: string): GovernanceVariable;
    getType(): string;
    setType(value: string): GovernanceVariable;
    getNotes(): string;
    setNotes(value: string): GovernanceVariable;
    getParentFolderId(): string;
    setParentFolderId(value: string): GovernanceVariable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GovernanceVariable.AsObject;
    static toObject(includeInstance: boolean, msg: GovernanceVariable): GovernanceVariable.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GovernanceVariable, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GovernanceVariable;
    static deserializeBinaryFromReader(message: GovernanceVariable, reader: jspb.BinaryReader): GovernanceVariable;
}

export namespace GovernanceVariable {
    export type AsObject = {
        id: string,
        name: string,
        type: string,
        notes: string,
        parentFolderId: string,
    }
}

export class GovernanceFolder extends jspb.Message { 
    getFolderId(): string;
    setFolderId(value: string): GovernanceFolder;
    getName(): string;
    setName(value: string): GovernanceFolder;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GovernanceFolder.AsObject;
    static toObject(includeInstance: boolean, msg: GovernanceFolder): GovernanceFolder.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GovernanceFolder, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GovernanceFolder;
    static deserializeBinaryFromReader(message: GovernanceFolder, reader: jspb.BinaryReader): GovernanceFolder;
}

export namespace GovernanceFolder {
    export type AsObject = {
        folderId: string,
        name: string,
    }
}

export class JavaScriptAnalysisRequest extends jspb.Message { 
    getRequestId(): string;
    setRequestId(value: string): JavaScriptAnalysisRequest;
    clearItemsList(): void;
    getItemsList(): Array<JavaScriptItem>;
    setItemsList(value: Array<JavaScriptItem>): JavaScriptAnalysisRequest;
    addItems(value?: JavaScriptItem, index?: number): JavaScriptItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JavaScriptAnalysisRequest.AsObject;
    static toObject(includeInstance: boolean, msg: JavaScriptAnalysisRequest): JavaScriptAnalysisRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JavaScriptAnalysisRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JavaScriptAnalysisRequest;
    static deserializeBinaryFromReader(message: JavaScriptAnalysisRequest, reader: jspb.BinaryReader): JavaScriptAnalysisRequest;
}

export namespace JavaScriptAnalysisRequest {
    export type AsObject = {
        requestId: string,
        itemsList: Array<JavaScriptItem.AsObject>,
    }
}

export class JavaScriptItem extends jspb.Message { 
    getId(): string;
    setId(value: string): JavaScriptItem;
    getName(): string;
    setName(value: string): JavaScriptItem;
    getType(): string;
    setType(value: string): JavaScriptItem;
    getElementType(): string;
    setElementType(value: string): JavaScriptItem;
    getJavascriptCode(): string;
    setJavascriptCode(value: string): JavaScriptItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): JavaScriptItem.AsObject;
    static toObject(includeInstance: boolean, msg: JavaScriptItem): JavaScriptItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: JavaScriptItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): JavaScriptItem;
    static deserializeBinaryFromReader(message: JavaScriptItem, reader: jspb.BinaryReader): JavaScriptItem;
}

export namespace JavaScriptItem {
    export type AsObject = {
        id: string,
        name: string,
        type: string,
        elementType: string,
        javascriptCode: string,
    }
}

export class HTMLAnalysisRequest extends jspb.Message { 
    getRequestId(): string;
    setRequestId(value: string): HTMLAnalysisRequest;
    clearItemsList(): void;
    getItemsList(): Array<HTMLItem>;
    setItemsList(value: Array<HTMLItem>): HTMLAnalysisRequest;
    addItems(value?: HTMLItem, index?: number): HTMLItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HTMLAnalysisRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HTMLAnalysisRequest): HTMLAnalysisRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HTMLAnalysisRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HTMLAnalysisRequest;
    static deserializeBinaryFromReader(message: HTMLAnalysisRequest, reader: jspb.BinaryReader): HTMLAnalysisRequest;
}

export namespace HTMLAnalysisRequest {
    export type AsObject = {
        requestId: string,
        itemsList: Array<HTMLItem.AsObject>,
    }
}

export class HTMLItem extends jspb.Message { 
    getId(): string;
    setId(value: string): HTMLItem;
    getName(): string;
    setName(value: string): HTMLItem;
    getType(): string;
    setType(value: string): HTMLItem;
    getElementType(): string;
    setElementType(value: string): HTMLItem;
    getHtmlCode(): string;
    setHtmlCode(value: string): HTMLItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HTMLItem.AsObject;
    static toObject(includeInstance: boolean, msg: HTMLItem): HTMLItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HTMLItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HTMLItem;
    static deserializeBinaryFromReader(message: HTMLItem, reader: jspb.BinaryReader): HTMLItem;
}

export namespace HTMLItem {
    export type AsObject = {
        id: string,
        name: string,
        type: string,
        elementType: string,
        htmlCode: string,
    }
}

export class AnalysisResponse extends jspb.Message { 
    getRequestId(): string;
    setRequestId(value: string): AnalysisResponse;
    getStatus(): AnalysisResponse.Status;
    setStatus(value: AnalysisResponse.Status): AnalysisResponse;

    getContainerInfoMap(): jspb.Map<string, string>;
    clearContainerInfoMap(): void;

    getResultsMap(): jspb.Map<string, ModuleResult>;
    clearResultsMap(): void;

    getSummaryMap(): jspb.Map<string, number>;
    clearSummaryMap(): void;
    getErrorMessage(): string;
    setErrorMessage(value: string): AnalysisResponse;

    hasStartedAt(): boolean;
    clearStartedAt(): void;
    getStartedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setStartedAt(value?: google_protobuf_timestamp_pb.Timestamp): AnalysisResponse;

    hasCompletedAt(): boolean;
    clearCompletedAt(): void;
    getCompletedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setCompletedAt(value?: google_protobuf_timestamp_pb.Timestamp): AnalysisResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AnalysisResponse.AsObject;
    static toObject(includeInstance: boolean, msg: AnalysisResponse): AnalysisResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AnalysisResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AnalysisResponse;
    static deserializeBinaryFromReader(message: AnalysisResponse, reader: jspb.BinaryReader): AnalysisResponse;
}

export namespace AnalysisResponse {
    export type AsObject = {
        requestId: string,
        status: AnalysisResponse.Status,

        containerInfoMap: Array<[string, string]>,

        resultsMap: Array<[string, ModuleResult.AsObject]>,

        summaryMap: Array<[string, number]>,
        errorMessage: string,
        startedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }

    export enum Status {
    STATUS_UNSPECIFIED = 0,
    PROCESSING = 1,
    COMPLETED = 2,
    FAILED = 3,
    PARTIAL = 4,
    }

}

export class HealthRequest extends jspb.Message { 
    getService(): string;
    setService(value: string): HealthRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HealthRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HealthRequest): HealthRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HealthRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HealthRequest;
    static deserializeBinaryFromReader(message: HealthRequest, reader: jspb.BinaryReader): HealthRequest;
}

export namespace HealthRequest {
    export type AsObject = {
        service: string,
    }
}

export class HealthResponse extends jspb.Message { 
    getStatus(): HealthResponse.Status;
    setStatus(value: HealthResponse.Status): HealthResponse;
    getMessage(): string;
    setMessage(value: string): HealthResponse;

    getMetadataMap(): jspb.Map<string, string>;
    clearMetadataMap(): void;

    hasTimestamp(): boolean;
    clearTimestamp(): void;
    getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): HealthResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HealthResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HealthResponse): HealthResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HealthResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HealthResponse;
    static deserializeBinaryFromReader(message: HealthResponse, reader: jspb.BinaryReader): HealthResponse;
}

export namespace HealthResponse {
    export type AsObject = {
        status: HealthResponse.Status,
        message: string,

        metadataMap: Array<[string, string]>,
        timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }

    export enum Status {
    STATUS_UNSPECIFIED = 0,
    SERVING = 1,
    NOT_SERVING = 2,
    SERVICE_UNKNOWN = 3,
    }

}

export class AnalysisStatusRequest extends jspb.Message { 
    getRequestId(): string;
    setRequestId(value: string): AnalysisStatusRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AnalysisStatusRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AnalysisStatusRequest): AnalysisStatusRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AnalysisStatusRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AnalysisStatusRequest;
    static deserializeBinaryFromReader(message: AnalysisStatusRequest, reader: jspb.BinaryReader): AnalysisStatusRequest;
}

export namespace AnalysisStatusRequest {
    export type AsObject = {
        requestId: string,
    }
}

export class FileUploadRequest extends jspb.Message { 

    hasMetadata(): boolean;
    clearMetadata(): void;
    getMetadata(): FileUploadRequest.FileMetadata | undefined;
    setMetadata(value?: FileUploadRequest.FileMetadata): FileUploadRequest;

    hasChunkData(): boolean;
    clearChunkData(): void;
    getChunkData(): Uint8Array | string;
    getChunkData_asU8(): Uint8Array;
    getChunkData_asB64(): string;
    setChunkData(value: Uint8Array | string): FileUploadRequest;

    hasConfig(): boolean;
    clearConfig(): void;
    getConfig(): FileUploadRequest.AnalysisConfig | undefined;
    setConfig(value?: FileUploadRequest.AnalysisConfig): FileUploadRequest;

    getRequestCase(): FileUploadRequest.RequestCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FileUploadRequest.AsObject;
    static toObject(includeInstance: boolean, msg: FileUploadRequest): FileUploadRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FileUploadRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FileUploadRequest;
    static deserializeBinaryFromReader(message: FileUploadRequest, reader: jspb.BinaryReader): FileUploadRequest;
}

export namespace FileUploadRequest {
    export type AsObject = {
        metadata?: FileUploadRequest.FileMetadata.AsObject,
        chunkData: Uint8Array | string,
        config?: FileUploadRequest.AnalysisConfig.AsObject,
    }


    export class FileMetadata extends jspb.Message { 
        getFilename(): string;
        setFilename(value: string): FileMetadata;
        getFileSize(): number;
        setFileSize(value: number): FileMetadata;
        getContentType(): string;
        setContentType(value: string): FileMetadata;
        getRequestId(): string;
        setRequestId(value: string): FileMetadata;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): FileMetadata.AsObject;
        static toObject(includeInstance: boolean, msg: FileMetadata): FileMetadata.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: FileMetadata, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): FileMetadata;
        static deserializeBinaryFromReader(message: FileMetadata, reader: jspb.BinaryReader): FileMetadata;
    }

    export namespace FileMetadata {
        export type AsObject = {
            filename: string,
            fileSize: number,
            contentType: string,
            requestId: string,
        }
    }

    export class AnalysisConfig extends jspb.Message { 
        clearSelectedModulesList(): void;
        getSelectedModulesList(): Array<string>;
        setSelectedModulesList(value: Array<string>): AnalysisConfig;
        addSelectedModules(value: string, index?: number): string;

        hasOptions(): boolean;
        clearOptions(): void;
        getOptions(): AnalysisOptions | undefined;
        setOptions(value?: AnalysisOptions): AnalysisConfig;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): AnalysisConfig.AsObject;
        static toObject(includeInstance: boolean, msg: AnalysisConfig): AnalysisConfig.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: AnalysisConfig, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): AnalysisConfig;
        static deserializeBinaryFromReader(message: AnalysisConfig, reader: jspb.BinaryReader): AnalysisConfig;
    }

    export namespace AnalysisConfig {
        export type AsObject = {
            selectedModulesList: Array<string>,
            options?: AnalysisOptions.AsObject,
        }
    }


    export enum RequestCase {
        REQUEST_NOT_SET = 0,
        METADATA = 1,
        CHUNK_DATA = 2,
        CONFIG = 3,
    }

}

export class ListModulesResponse extends jspb.Message { 
    clearModulesList(): void;
    getModulesList(): Array<ListModulesResponse.ModuleInfo>;
    setModulesList(value: Array<ListModulesResponse.ModuleInfo>): ListModulesResponse;
    addModules(value?: ListModulesResponse.ModuleInfo, index?: number): ListModulesResponse.ModuleInfo;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListModulesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListModulesResponse): ListModulesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListModulesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListModulesResponse;
    static deserializeBinaryFromReader(message: ListModulesResponse, reader: jspb.BinaryReader): ListModulesResponse;
}

export namespace ListModulesResponse {
    export type AsObject = {
        modulesList: Array<ListModulesResponse.ModuleInfo.AsObject>,
    }


    export class ModuleInfo extends jspb.Message { 
        getName(): string;
        setName(value: string): ModuleInfo;
        getVersion(): string;
        setVersion(value: string): ModuleInfo;
        getDescription(): string;
        setDescription(value: string): ModuleInfo;
        getAvailable(): boolean;
        setAvailable(value: boolean): ModuleInfo;

        getCapabilitiesMap(): jspb.Map<string, string>;
        clearCapabilitiesMap(): void;

        serializeBinary(): Uint8Array;
        toObject(includeInstance?: boolean): ModuleInfo.AsObject;
        static toObject(includeInstance: boolean, msg: ModuleInfo): ModuleInfo.AsObject;
        static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
        static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
        static serializeBinaryToWriter(message: ModuleInfo, writer: jspb.BinaryWriter): void;
        static deserializeBinary(bytes: Uint8Array): ModuleInfo;
        static deserializeBinaryFromReader(message: ModuleInfo, reader: jspb.BinaryReader): ModuleInfo;
    }

    export namespace ModuleInfo {
        export type AsObject = {
            name: string,
            version: string,
            description: string,
            available: boolean,

            capabilitiesMap: Array<[string, string]>,
        }
    }

}
