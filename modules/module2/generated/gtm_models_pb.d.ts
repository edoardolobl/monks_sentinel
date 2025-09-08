// package: gtm.models.v1
// file: gtm_models.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class APIVersion extends jspb.Message { 
    getVersion(): string;
    setVersion(value: string): APIVersion;
    getSchemaVersion(): number;
    setSchemaVersion(value: number): APIVersion;
    getTimestamp(): number;
    setTimestamp(value: number): APIVersion;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): APIVersion.AsObject;
    static toObject(includeInstance: boolean, msg: APIVersion): APIVersion.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: APIVersion, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): APIVersion;
    static deserializeBinaryFromReader(message: APIVersion, reader: jspb.BinaryReader): APIVersion;
}

export namespace APIVersion {
    export type AsObject = {
        version: string,
        schemaVersion: number,
        timestamp: number,
    }
}

export class Parameter extends jspb.Message { 
    getKey(): string;
    setKey(value: string): Parameter;
    getValue(): string;
    setValue(value: string): Parameter;
    clearListList(): void;
    getListList(): Array<KeyValue>;
    setListList(value: Array<KeyValue>): Parameter;
    addList(value?: KeyValue, index?: number): KeyValue;
    clearMapList(): void;
    getMapList(): Array<KeyValue>;
    setMapList(value: Array<KeyValue>): Parameter;
    addMap(value?: KeyValue, index?: number): KeyValue;
    getType(): string;
    setType(value: string): Parameter;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Parameter.AsObject;
    static toObject(includeInstance: boolean, msg: Parameter): Parameter.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Parameter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Parameter;
    static deserializeBinaryFromReader(message: Parameter, reader: jspb.BinaryReader): Parameter;
}

export namespace Parameter {
    export type AsObject = {
        key: string,
        value: string,
        listList: Array<KeyValue.AsObject>,
        mapList: Array<KeyValue.AsObject>,
        type: string,
    }
}

export class KeyValue extends jspb.Message { 
    getKey(): string;
    setKey(value: string): KeyValue;
    getValue(): string;
    setValue(value: string): KeyValue;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): KeyValue.AsObject;
    static toObject(includeInstance: boolean, msg: KeyValue): KeyValue.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: KeyValue, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): KeyValue;
    static deserializeBinaryFromReader(message: KeyValue, reader: jspb.BinaryReader): KeyValue;
}

export namespace KeyValue {
    export type AsObject = {
        key: string,
        value: string,
    }
}

export class ConsentSettings extends jspb.Message { 
    getConsentStatus(): ConsentSettings.ConsentStatus;
    setConsentStatus(value: ConsentSettings.ConsentStatus): ConsentSettings;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConsentSettings.AsObject;
    static toObject(includeInstance: boolean, msg: ConsentSettings): ConsentSettings.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConsentSettings, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConsentSettings;
    static deserializeBinaryFromReader(message: ConsentSettings, reader: jspb.BinaryReader): ConsentSettings;
}

export namespace ConsentSettings {
    export type AsObject = {
        consentStatus: ConsentSettings.ConsentStatus,
    }

    export enum ConsentStatus {
    CONSENT_STATUS_UNSPECIFIED = 0,
    NOT_SET = 1,
    NEEDED = 2,
    NOT_NEEDED = 3,
    }

}

export class MonitoringMetadata extends jspb.Message { 
    getType(): string;
    setType(value: string): MonitoringMetadata;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MonitoringMetadata.AsObject;
    static toObject(includeInstance: boolean, msg: MonitoringMetadata): MonitoringMetadata.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MonitoringMetadata, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MonitoringMetadata;
    static deserializeBinaryFromReader(message: MonitoringMetadata, reader: jspb.BinaryReader): MonitoringMetadata;
}

export namespace MonitoringMetadata {
    export type AsObject = {
        type: string,
    }
}

export class Tag extends jspb.Message { 
    getTagId(): string;
    setTagId(value: string): Tag;
    getName(): string;
    setName(value: string): Tag;
    getType(): string;
    setType(value: string): Tag;
    clearParameterList(): void;
    getParameterList(): Array<Parameter>;
    setParameterList(value: Array<Parameter>): Tag;
    addParameter(value?: Parameter, index?: number): Parameter;
    clearFiringTriggerIdList(): void;
    getFiringTriggerIdList(): Array<string>;
    setFiringTriggerIdList(value: Array<string>): Tag;
    addFiringTriggerId(value: string, index?: number): string;
    clearBlockingTriggerIdList(): void;
    getBlockingTriggerIdList(): Array<string>;
    setBlockingTriggerIdList(value: Array<string>): Tag;
    addBlockingTriggerId(value: string, index?: number): string;
    clearSetupTagList(): void;
    getSetupTagList(): Array<SetupTeardownTag>;
    setSetupTagList(value: Array<SetupTeardownTag>): Tag;
    addSetupTag(value?: SetupTeardownTag, index?: number): SetupTeardownTag;
    clearTeardownTagList(): void;
    getTeardownTagList(): Array<SetupTeardownTag>;
    setTeardownTagList(value: Array<SetupTeardownTag>): Tag;
    addTeardownTag(value?: SetupTeardownTag, index?: number): SetupTeardownTag;
    getParentFolderId(): string;
    setParentFolderId(value: string): Tag;
    getTagFiringOption(): string;
    setTagFiringOption(value: string): Tag;

    hasConsentSettings(): boolean;
    clearConsentSettings(): void;
    getConsentSettings(): ConsentSettings | undefined;
    setConsentSettings(value?: ConsentSettings): Tag;
    getNotes(): string;
    setNotes(value: string): Tag;
    getFingerprint(): string;
    setFingerprint(value: string): Tag;

    hasMonitoringMetadata(): boolean;
    clearMonitoringMetadata(): void;
    getMonitoringMetadata(): MonitoringMetadata | undefined;
    setMonitoringMetadata(value?: MonitoringMetadata): Tag;
    getMonitoringMetadataTagNameKey(): string;
    setMonitoringMetadataTagNameKey(value: string): Tag;
    getAccountId(): string;
    setAccountId(value: string): Tag;
    getContainerId(): string;
    setContainerId(value: string): Tag;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): Tag;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Tag.AsObject;
    static toObject(includeInstance: boolean, msg: Tag): Tag.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Tag, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Tag;
    static deserializeBinaryFromReader(message: Tag, reader: jspb.BinaryReader): Tag;
}

export namespace Tag {
    export type AsObject = {
        tagId: string,
        name: string,
        type: string,
        parameterList: Array<Parameter.AsObject>,
        firingTriggerIdList: Array<string>,
        blockingTriggerIdList: Array<string>,
        setupTagList: Array<SetupTeardownTag.AsObject>,
        teardownTagList: Array<SetupTeardownTag.AsObject>,
        parentFolderId: string,
        tagFiringOption: string,
        consentSettings?: ConsentSettings.AsObject,
        notes: string,
        fingerprint: string,
        monitoringMetadata?: MonitoringMetadata.AsObject,
        monitoringMetadataTagNameKey: string,
        accountId: string,
        containerId: string,
        apiVersion?: APIVersion.AsObject,
    }
}

export class SetupTeardownTag extends jspb.Message { 
    getTagId(): string;
    setTagId(value: string): SetupTeardownTag;
    getStopOnSetupFailure(): string;
    setStopOnSetupFailure(value: string): SetupTeardownTag;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetupTeardownTag.AsObject;
    static toObject(includeInstance: boolean, msg: SetupTeardownTag): SetupTeardownTag.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetupTeardownTag, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetupTeardownTag;
    static deserializeBinaryFromReader(message: SetupTeardownTag, reader: jspb.BinaryReader): SetupTeardownTag;
}

export namespace SetupTeardownTag {
    export type AsObject = {
        tagId: string,
        stopOnSetupFailure: string,
    }
}

export class Trigger extends jspb.Message { 
    getTriggerId(): string;
    setTriggerId(value: string): Trigger;
    getName(): string;
    setName(value: string): Trigger;
    getType(): string;
    setType(value: string): Trigger;
    clearCustomEventFilterList(): void;
    getCustomEventFilterList(): Array<TriggerFilter>;
    setCustomEventFilterList(value: Array<TriggerFilter>): Trigger;
    addCustomEventFilter(value?: TriggerFilter, index?: number): TriggerFilter;
    clearFilterList(): void;
    getFilterList(): Array<TriggerFilter>;
    setFilterList(value: Array<TriggerFilter>): Trigger;
    addFilter(value?: TriggerFilter, index?: number): TriggerFilter;
    getFingerprint(): string;
    setFingerprint(value: string): Trigger;
    getAccountId(): string;
    setAccountId(value: string): Trigger;
    getContainerId(): string;
    setContainerId(value: string): Trigger;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): Trigger;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Trigger.AsObject;
    static toObject(includeInstance: boolean, msg: Trigger): Trigger.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Trigger, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Trigger;
    static deserializeBinaryFromReader(message: Trigger, reader: jspb.BinaryReader): Trigger;
}

export namespace Trigger {
    export type AsObject = {
        triggerId: string,
        name: string,
        type: string,
        customEventFilterList: Array<TriggerFilter.AsObject>,
        filterList: Array<TriggerFilter.AsObject>,
        fingerprint: string,
        accountId: string,
        containerId: string,
        apiVersion?: APIVersion.AsObject,
    }
}

export class TriggerFilter extends jspb.Message { 
    getParameter(): string;
    setParameter(value: string): TriggerFilter;
    getType(): string;
    setType(value: string): TriggerFilter;
    getValue(): string;
    setValue(value: string): TriggerFilter;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TriggerFilter.AsObject;
    static toObject(includeInstance: boolean, msg: TriggerFilter): TriggerFilter.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TriggerFilter, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TriggerFilter;
    static deserializeBinaryFromReader(message: TriggerFilter, reader: jspb.BinaryReader): TriggerFilter;
}

export namespace TriggerFilter {
    export type AsObject = {
        parameter: string,
        type: string,
        value: string,
    }
}

export class Variable extends jspb.Message { 
    getVariableId(): string;
    setVariableId(value: string): Variable;
    getName(): string;
    setName(value: string): Variable;
    getType(): string;
    setType(value: string): Variable;
    clearParameterList(): void;
    getParameterList(): Array<Parameter>;
    setParameterList(value: Array<Parameter>): Variable;
    addParameter(value?: Parameter, index?: number): Parameter;

    hasFormatValue(): boolean;
    clearFormatValue(): void;
    getFormatValue(): FormatValue | undefined;
    setFormatValue(value?: FormatValue): Variable;
    getFingerprint(): string;
    setFingerprint(value: string): Variable;
    getAccountId(): string;
    setAccountId(value: string): Variable;
    getContainerId(): string;
    setContainerId(value: string): Variable;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): Variable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Variable.AsObject;
    static toObject(includeInstance: boolean, msg: Variable): Variable.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Variable, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Variable;
    static deserializeBinaryFromReader(message: Variable, reader: jspb.BinaryReader): Variable;
}

export namespace Variable {
    export type AsObject = {
        variableId: string,
        name: string,
        type: string,
        parameterList: Array<Parameter.AsObject>,
        formatValue?: FormatValue.AsObject,
        fingerprint: string,
        accountId: string,
        containerId: string,
        apiVersion?: APIVersion.AsObject,
    }
}

export class FormatValue extends jspb.Message { 
    getConversionType(): string;
    setConversionType(value: string): FormatValue;
    getCaseConversion(): string;
    setCaseConversion(value: string): FormatValue;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FormatValue.AsObject;
    static toObject(includeInstance: boolean, msg: FormatValue): FormatValue.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FormatValue, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FormatValue;
    static deserializeBinaryFromReader(message: FormatValue, reader: jspb.BinaryReader): FormatValue;
}

export namespace FormatValue {
    export type AsObject = {
        conversionType: string,
        caseConversion: string,
    }
}

export class BuiltInVariable extends jspb.Message { 
    getType(): string;
    setType(value: string): BuiltInVariable;
    getName(): string;
    setName(value: string): BuiltInVariable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BuiltInVariable.AsObject;
    static toObject(includeInstance: boolean, msg: BuiltInVariable): BuiltInVariable.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BuiltInVariable, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BuiltInVariable;
    static deserializeBinaryFromReader(message: BuiltInVariable, reader: jspb.BinaryReader): BuiltInVariable;
}

export namespace BuiltInVariable {
    export type AsObject = {
        type: string,
        name: string,
    }
}

export class Folder extends jspb.Message { 
    getFolderId(): string;
    setFolderId(value: string): Folder;
    getName(): string;
    setName(value: string): Folder;
    getFingerprint(): string;
    setFingerprint(value: string): Folder;
    getAccountId(): string;
    setAccountId(value: string): Folder;
    getContainerId(): string;
    setContainerId(value: string): Folder;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): Folder;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Folder.AsObject;
    static toObject(includeInstance: boolean, msg: Folder): Folder.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Folder, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Folder;
    static deserializeBinaryFromReader(message: Folder, reader: jspb.BinaryReader): Folder;
}

export namespace Folder {
    export type AsObject = {
        folderId: string,
        name: string,
        fingerprint: string,
        accountId: string,
        containerId: string,
        apiVersion?: APIVersion.AsObject,
    }
}

export class Zone extends jspb.Message { 
    getZoneId(): string;
    setZoneId(value: string): Zone;
    getName(): string;
    setName(value: string): Zone;
    getZoneTypeId(): string;
    setZoneTypeId(value: string): Zone;
    getNotes(): string;
    setNotes(value: string): Zone;
    getFingerprint(): string;
    setFingerprint(value: string): Zone;
    getAccountId(): string;
    setAccountId(value: string): Zone;
    getContainerId(): string;
    setContainerId(value: string): Zone;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): Zone;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Zone.AsObject;
    static toObject(includeInstance: boolean, msg: Zone): Zone.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Zone, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Zone;
    static deserializeBinaryFromReader(message: Zone, reader: jspb.BinaryReader): Zone;
}

export namespace Zone {
    export type AsObject = {
        zoneId: string,
        name: string,
        zoneTypeId: string,
        notes: string,
        fingerprint: string,
        accountId: string,
        containerId: string,
        apiVersion?: APIVersion.AsObject,
    }
}

export class Template extends jspb.Message { 
    getTemplateId(): string;
    setTemplateId(value: string): Template;
    getName(): string;
    setName(value: string): Template;

    hasGalleryReference(): boolean;
    clearGalleryReference(): void;
    getGalleryReference(): GalleryReference | undefined;
    setGalleryReference(value?: GalleryReference): Template;
    getTemplateData(): string;
    setTemplateData(value: string): Template;
    getFingerprint(): string;
    setFingerprint(value: string): Template;
    getAccountId(): string;
    setAccountId(value: string): Template;
    getContainerId(): string;
    setContainerId(value: string): Template;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): Template;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Template.AsObject;
    static toObject(includeInstance: boolean, msg: Template): Template.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Template, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Template;
    static deserializeBinaryFromReader(message: Template, reader: jspb.BinaryReader): Template;
}

export namespace Template {
    export type AsObject = {
        templateId: string,
        name: string,
        galleryReference?: GalleryReference.AsObject,
        templateData: string,
        fingerprint: string,
        accountId: string,
        containerId: string,
        apiVersion?: APIVersion.AsObject,
    }
}

export class GalleryReference extends jspb.Message { 
    getGalleryId(): string;
    setGalleryId(value: string): GalleryReference;
    getVersion(): string;
    setVersion(value: string): GalleryReference;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GalleryReference.AsObject;
    static toObject(includeInstance: boolean, msg: GalleryReference): GalleryReference.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GalleryReference, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GalleryReference;
    static deserializeBinaryFromReader(message: GalleryReference, reader: jspb.BinaryReader): GalleryReference;
}

export namespace GalleryReference {
    export type AsObject = {
        galleryId: string,
        version: string,
    }
}

export class ContainerFeatures extends jspb.Message { 
    getSupportUserPermissions(): boolean;
    setSupportUserPermissions(value: boolean): ContainerFeatures;
    getSupportEnvironments(): boolean;
    setSupportEnvironments(value: boolean): ContainerFeatures;
    getSupportWorkspaces(): boolean;
    setSupportWorkspaces(value: boolean): ContainerFeatures;
    getSupportGtagConfigs(): boolean;
    setSupportGtagConfigs(value: boolean): ContainerFeatures;
    getSupportBuiltInVariables(): boolean;
    setSupportBuiltInVariables(value: boolean): ContainerFeatures;
    getSupportClients(): boolean;
    setSupportClients(value: boolean): ContainerFeatures;
    getSupportFolders(): boolean;
    setSupportFolders(value: boolean): ContainerFeatures;
    getSupportTags(): boolean;
    setSupportTags(value: boolean): ContainerFeatures;
    getSupportTemplates(): boolean;
    setSupportTemplates(value: boolean): ContainerFeatures;
    getSupportTriggers(): boolean;
    setSupportTriggers(value: boolean): ContainerFeatures;
    getSupportVariables(): boolean;
    setSupportVariables(value: boolean): ContainerFeatures;
    getSupportVersions(): boolean;
    setSupportVersions(value: boolean): ContainerFeatures;
    getSupportZones(): boolean;
    setSupportZones(value: boolean): ContainerFeatures;
    getSupportTransformations(): boolean;
    setSupportTransformations(value: boolean): ContainerFeatures;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ContainerFeatures.AsObject;
    static toObject(includeInstance: boolean, msg: ContainerFeatures): ContainerFeatures.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ContainerFeatures, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ContainerFeatures;
    static deserializeBinaryFromReader(message: ContainerFeatures, reader: jspb.BinaryReader): ContainerFeatures;
}

export namespace ContainerFeatures {
    export type AsObject = {
        supportUserPermissions: boolean,
        supportEnvironments: boolean,
        supportWorkspaces: boolean,
        supportGtagConfigs: boolean,
        supportBuiltInVariables: boolean,
        supportClients: boolean,
        supportFolders: boolean,
        supportTags: boolean,
        supportTemplates: boolean,
        supportTriggers: boolean,
        supportVariables: boolean,
        supportVersions: boolean,
        supportZones: boolean,
        supportTransformations: boolean,
    }
}

export class Container extends jspb.Message { 
    getName(): string;
    setName(value: string): Container;
    getPublicId(): string;
    setPublicId(value: string): Container;
    getContainerId(): string;
    setContainerId(value: string): Container;
    getAccountId(): string;
    setAccountId(value: string): Container;
    getPath(): string;
    setPath(value: string): Container;
    clearUsageContextList(): void;
    getUsageContextList(): Array<string>;
    setUsageContextList(value: Array<string>): Container;
    addUsageContext(value: string, index?: number): string;
    getFingerprint(): string;
    setFingerprint(value: string): Container;
    getTagManagerUrl(): string;
    setTagManagerUrl(value: string): Container;

    hasFeatures(): boolean;
    clearFeatures(): void;
    getFeatures(): ContainerFeatures | undefined;
    setFeatures(value?: ContainerFeatures): Container;
    clearTagIdsList(): void;
    getTagIdsList(): Array<string>;
    setTagIdsList(value: Array<string>): Container;
    addTagIds(value: string, index?: number): string;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): Container;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Container.AsObject;
    static toObject(includeInstance: boolean, msg: Container): Container.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Container, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Container;
    static deserializeBinaryFromReader(message: Container, reader: jspb.BinaryReader): Container;
}

export namespace Container {
    export type AsObject = {
        name: string,
        publicId: string,
        containerId: string,
        accountId: string,
        path: string,
        usageContextList: Array<string>,
        fingerprint: string,
        tagManagerUrl: string,
        features?: ContainerFeatures.AsObject,
        tagIdsList: Array<string>,
        apiVersion?: APIVersion.AsObject,
    }
}

export class ContainerVersion extends jspb.Message { 

    hasContainer(): boolean;
    clearContainer(): void;
    getContainer(): Container | undefined;
    setContainer(value?: Container): ContainerVersion;
    clearTagList(): void;
    getTagList(): Array<Tag>;
    setTagList(value: Array<Tag>): ContainerVersion;
    addTag(value?: Tag, index?: number): Tag;
    clearTriggerList(): void;
    getTriggerList(): Array<Trigger>;
    setTriggerList(value: Array<Trigger>): ContainerVersion;
    addTrigger(value?: Trigger, index?: number): Trigger;
    clearVariableList(): void;
    getVariableList(): Array<Variable>;
    setVariableList(value: Array<Variable>): ContainerVersion;
    addVariable(value?: Variable, index?: number): Variable;
    clearBuiltInVariableList(): void;
    getBuiltInVariableList(): Array<BuiltInVariable>;
    setBuiltInVariableList(value: Array<BuiltInVariable>): ContainerVersion;
    addBuiltInVariable(value?: BuiltInVariable, index?: number): BuiltInVariable;
    clearFolderList(): void;
    getFolderList(): Array<Folder>;
    setFolderList(value: Array<Folder>): ContainerVersion;
    addFolder(value?: Folder, index?: number): Folder;
    clearZoneList(): void;
    getZoneList(): Array<Zone>;
    setZoneList(value: Array<Zone>): ContainerVersion;
    addZone(value?: Zone, index?: number): Zone;
    clearTemplateList(): void;
    getTemplateList(): Array<Template>;
    setTemplateList(value: Array<Template>): ContainerVersion;
    addTemplate(value?: Template, index?: number): Template;
    getPath(): string;
    setPath(value: string): ContainerVersion;
    getAccountId(): string;
    setAccountId(value: string): ContainerVersion;
    getContainerId(): string;
    setContainerId(value: string): ContainerVersion;
    getContainerVersionId(): string;
    setContainerVersionId(value: string): ContainerVersion;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): ContainerVersion;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ContainerVersion.AsObject;
    static toObject(includeInstance: boolean, msg: ContainerVersion): ContainerVersion.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ContainerVersion, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ContainerVersion;
    static deserializeBinaryFromReader(message: ContainerVersion, reader: jspb.BinaryReader): ContainerVersion;
}

export namespace ContainerVersion {
    export type AsObject = {
        container?: Container.AsObject,
        tagList: Array<Tag.AsObject>,
        triggerList: Array<Trigger.AsObject>,
        variableList: Array<Variable.AsObject>,
        builtInVariableList: Array<BuiltInVariable.AsObject>,
        folderList: Array<Folder.AsObject>,
        zoneList: Array<Zone.AsObject>,
        templateList: Array<Template.AsObject>,
        path: string,
        accountId: string,
        containerId: string,
        containerVersionId: string,
        apiVersion?: APIVersion.AsObject,
    }
}

export class GTMContainer extends jspb.Message { 
    getExportFormatVersion(): number;
    setExportFormatVersion(value: number): GTMContainer;
    getExportTime(): string;
    setExportTime(value: string): GTMContainer;

    hasContainerVersion(): boolean;
    clearContainerVersion(): void;
    getContainerVersion(): ContainerVersion | undefined;
    setContainerVersion(value?: ContainerVersion): GTMContainer;

    hasApiVersion(): boolean;
    clearApiVersion(): void;
    getApiVersion(): APIVersion | undefined;
    setApiVersion(value?: APIVersion): GTMContainer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GTMContainer.AsObject;
    static toObject(includeInstance: boolean, msg: GTMContainer): GTMContainer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GTMContainer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GTMContainer;
    static deserializeBinaryFromReader(message: GTMContainer, reader: jspb.BinaryReader): GTMContainer;
}

export namespace GTMContainer {
    export type AsObject = {
        exportFormatVersion: number,
        exportTime: string,
        containerVersion?: ContainerVersion.AsObject,
        apiVersion?: APIVersion.AsObject,
    }
}
