import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace types. */
export namespace types {

    /** Properties of an Account. */
    interface IAccount {

        /** Account address */
        address?: (Uint8Array|null);

        /** Account amount */
        amount?: (number|Long|null);
    }

    /** Represents an Account. */
    class Account implements IAccount {

        /**
         * Constructs a new Account.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IAccount);

        /** Account address. */
        public address: Uint8Array;

        /** Account amount. */
        public amount: (number|Long);

        /**
         * Creates a new Account instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Account instance
         */
        public static create(properties?: types.IAccount): types.Account;

        /**
         * Encodes the specified Account message. Does not implicitly {@link types.Account.verify|verify} messages.
         * @param message Account message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Account message, length delimited. Does not implicitly {@link types.Account.verify|verify} messages.
         * @param message Account message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IAccount, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Account message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Account
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Account;

        /**
         * Decodes an Account message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Account
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Account;

        /**
         * Verifies an Account message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Account message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Account
         */
        public static fromObject(object: { [k: string]: any }): types.Account;

        /**
         * Creates a plain object from an Account message. Also converts values to other types if specified.
         * @param message Account
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Account, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Account to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Account
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Pool. */
    interface IPool {

        /** Pool id */
        id?: (number|Long|null);

        /** Pool amount */
        amount?: (number|Long|null);
    }

    /** Represents a Pool. */
    class Pool implements IPool {

        /**
         * Constructs a new Pool.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPool);

        /** Pool id. */
        public id: (number|Long);

        /** Pool amount. */
        public amount: (number|Long);

        /**
         * Creates a new Pool instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Pool instance
         */
        public static create(properties?: types.IPool): types.Pool;

        /**
         * Encodes the specified Pool message. Does not implicitly {@link types.Pool.verify|verify} messages.
         * @param message Pool message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPool, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Pool message, length delimited. Does not implicitly {@link types.Pool.verify|verify} messages.
         * @param message Pool message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPool, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Pool message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Pool
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Pool;

        /**
         * Decodes a Pool message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Pool
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Pool;

        /**
         * Verifies a Pool message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Pool message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Pool
         */
        public static fromObject(object: { [k: string]: any }): types.Pool;

        /**
         * Creates a plain object from a Pool message. Also converts values to other types if specified.
         * @param message Pool
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Pool, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Pool to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Pool
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Event. */
    interface IEvent {

        /** Event eventType */
        eventType?: (string|null);

        /** Event custom */
        custom?: (types.IEventCustom|null);

        /** Event height */
        height?: (number|Long|null);

        /** Event reference */
        reference?: (string|null);

        /** Event chainId */
        chainId?: (number|Long|null);

        /** Event blockHeight */
        blockHeight?: (number|Long|null);

        /** Event blockHash */
        blockHash?: (Uint8Array|null);

        /** Event address */
        address?: (Uint8Array|null);
    }

    /** Represents an Event. */
    class Event implements IEvent {

        /**
         * Constructs a new Event.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IEvent);

        /** Event eventType. */
        public eventType: string;

        /** Event custom. */
        public custom?: (types.IEventCustom|null);

        /** Event height. */
        public height: (number|Long);

        /** Event reference. */
        public reference: string;

        /** Event chainId. */
        public chainId: (number|Long);

        /** Event blockHeight. */
        public blockHeight: (number|Long);

        /** Event blockHash. */
        public blockHash: Uint8Array;

        /** Event address. */
        public address: Uint8Array;

        /** Event msg. */
        public msg?: "custom";

        /**
         * Creates a new Event instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Event instance
         */
        public static create(properties?: types.IEvent): types.Event;

        /**
         * Encodes the specified Event message. Does not implicitly {@link types.Event.verify|verify} messages.
         * @param message Event message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Event message, length delimited. Does not implicitly {@link types.Event.verify|verify} messages.
         * @param message Event message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Event message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Event;

        /**
         * Decodes an Event message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Event
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Event;

        /**
         * Verifies an Event message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Event message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Event
         */
        public static fromObject(object: { [k: string]: any }): types.Event;

        /**
         * Creates a plain object from an Event message. Also converts values to other types if specified.
         * @param message Event
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Event to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Event
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EventCustom. */
    interface IEventCustom {

        /** EventCustom msg */
        msg?: (google.protobuf.IAny|null);
    }

    /** Represents an EventCustom. */
    class EventCustom implements IEventCustom {

        /**
         * Constructs a new EventCustom.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IEventCustom);

        /** EventCustom msg. */
        public msg?: (google.protobuf.IAny|null);

        /**
         * Creates a new EventCustom instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventCustom instance
         */
        public static create(properties?: types.IEventCustom): types.EventCustom;

        /**
         * Encodes the specified EventCustom message. Does not implicitly {@link types.EventCustom.verify|verify} messages.
         * @param message EventCustom message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IEventCustom, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventCustom message, length delimited. Does not implicitly {@link types.EventCustom.verify|verify} messages.
         * @param message EventCustom message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IEventCustom, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventCustom message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventCustom
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.EventCustom;

        /**
         * Decodes an EventCustom message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventCustom
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.EventCustom;

        /**
         * Verifies an EventCustom message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EventCustom message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EventCustom
         */
        public static fromObject(object: { [k: string]: any }): types.EventCustom;

        /**
         * Creates a plain object from an EventCustom message. Also converts values to other types if specified.
         * @param message EventCustom
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.EventCustom, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EventCustom to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EventCustom
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FSMToPlugin. */
    interface IFSMToPlugin {

        /** FSMToPlugin id */
        id?: (number|Long|null);

        /** FSMToPlugin config */
        config?: (types.IPluginFSMConfig|null);

        /** FSMToPlugin genesis */
        genesis?: (types.IPluginGenesisRequest|null);

        /** FSMToPlugin begin */
        begin?: (types.IPluginBeginRequest|null);

        /** FSMToPlugin check */
        check?: (types.IPluginCheckRequest|null);

        /** FSMToPlugin deliver */
        deliver?: (types.IPluginDeliverRequest|null);

        /** FSMToPlugin end */
        end?: (types.IPluginEndRequest|null);

        /** FSMToPlugin stateRead */
        stateRead?: (types.IPluginStateReadResponse|null);

        /** FSMToPlugin stateWrite */
        stateWrite?: (types.IPluginStateWriteResponse|null);

        /** FSMToPlugin error */
        error?: (types.IPluginError|null);
    }

    /** Represents a FSMToPlugin. */
    class FSMToPlugin implements IFSMToPlugin {

        /**
         * Constructs a new FSMToPlugin.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IFSMToPlugin);

        /** FSMToPlugin id. */
        public id: (number|Long);

        /** FSMToPlugin config. */
        public config?: (types.IPluginFSMConfig|null);

        /** FSMToPlugin genesis. */
        public genesis?: (types.IPluginGenesisRequest|null);

        /** FSMToPlugin begin. */
        public begin?: (types.IPluginBeginRequest|null);

        /** FSMToPlugin check. */
        public check?: (types.IPluginCheckRequest|null);

        /** FSMToPlugin deliver. */
        public deliver?: (types.IPluginDeliverRequest|null);

        /** FSMToPlugin end. */
        public end?: (types.IPluginEndRequest|null);

        /** FSMToPlugin stateRead. */
        public stateRead?: (types.IPluginStateReadResponse|null);

        /** FSMToPlugin stateWrite. */
        public stateWrite?: (types.IPluginStateWriteResponse|null);

        /** FSMToPlugin error. */
        public error?: (types.IPluginError|null);

        /** FSMToPlugin payload. */
        public payload?: ("config"|"genesis"|"begin"|"check"|"deliver"|"end"|"stateRead"|"stateWrite"|"error");

        /**
         * Creates a new FSMToPlugin instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FSMToPlugin instance
         */
        public static create(properties?: types.IFSMToPlugin): types.FSMToPlugin;

        /**
         * Encodes the specified FSMToPlugin message. Does not implicitly {@link types.FSMToPlugin.verify|verify} messages.
         * @param message FSMToPlugin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IFSMToPlugin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FSMToPlugin message, length delimited. Does not implicitly {@link types.FSMToPlugin.verify|verify} messages.
         * @param message FSMToPlugin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IFSMToPlugin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FSMToPlugin message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FSMToPlugin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.FSMToPlugin;

        /**
         * Decodes a FSMToPlugin message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FSMToPlugin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.FSMToPlugin;

        /**
         * Verifies a FSMToPlugin message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FSMToPlugin message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FSMToPlugin
         */
        public static fromObject(object: { [k: string]: any }): types.FSMToPlugin;

        /**
         * Creates a plain object from a FSMToPlugin message. Also converts values to other types if specified.
         * @param message FSMToPlugin
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.FSMToPlugin, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FSMToPlugin to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FSMToPlugin
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginToFSM. */
    interface IPluginToFSM {

        /** PluginToFSM id */
        id?: (number|Long|null);

        /** PluginToFSM config */
        config?: (types.IPluginConfig|null);

        /** PluginToFSM genesis */
        genesis?: (types.IPluginGenesisResponse|null);

        /** PluginToFSM begin */
        begin?: (types.IPluginBeginResponse|null);

        /** PluginToFSM check */
        check?: (types.IPluginCheckResponse|null);

        /** PluginToFSM deliver */
        deliver?: (types.IPluginDeliverResponse|null);

        /** PluginToFSM end */
        end?: (types.IPluginEndResponse|null);

        /** PluginToFSM stateRead */
        stateRead?: (types.IPluginStateReadRequest|null);

        /** PluginToFSM stateWrite */
        stateWrite?: (types.IPluginStateWriteRequest|null);
    }

    /** Represents a PluginToFSM. */
    class PluginToFSM implements IPluginToFSM {

        /**
         * Constructs a new PluginToFSM.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginToFSM);

        /** PluginToFSM id. */
        public id: (number|Long);

        /** PluginToFSM config. */
        public config?: (types.IPluginConfig|null);

        /** PluginToFSM genesis. */
        public genesis?: (types.IPluginGenesisResponse|null);

        /** PluginToFSM begin. */
        public begin?: (types.IPluginBeginResponse|null);

        /** PluginToFSM check. */
        public check?: (types.IPluginCheckResponse|null);

        /** PluginToFSM deliver. */
        public deliver?: (types.IPluginDeliverResponse|null);

        /** PluginToFSM end. */
        public end?: (types.IPluginEndResponse|null);

        /** PluginToFSM stateRead. */
        public stateRead?: (types.IPluginStateReadRequest|null);

        /** PluginToFSM stateWrite. */
        public stateWrite?: (types.IPluginStateWriteRequest|null);

        /** PluginToFSM payload. */
        public payload?: ("config"|"genesis"|"begin"|"check"|"deliver"|"end"|"stateRead"|"stateWrite");

        /**
         * Creates a new PluginToFSM instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginToFSM instance
         */
        public static create(properties?: types.IPluginToFSM): types.PluginToFSM;

        /**
         * Encodes the specified PluginToFSM message. Does not implicitly {@link types.PluginToFSM.verify|verify} messages.
         * @param message PluginToFSM message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginToFSM, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginToFSM message, length delimited. Does not implicitly {@link types.PluginToFSM.verify|verify} messages.
         * @param message PluginToFSM message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginToFSM, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginToFSM message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginToFSM
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginToFSM;

        /**
         * Decodes a PluginToFSM message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginToFSM
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginToFSM;

        /**
         * Verifies a PluginToFSM message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginToFSM message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginToFSM
         */
        public static fromObject(object: { [k: string]: any }): types.PluginToFSM;

        /**
         * Creates a plain object from a PluginToFSM message. Also converts values to other types if specified.
         * @param message PluginToFSM
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginToFSM, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginToFSM to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginToFSM
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginConfig. */
    interface IPluginConfig {

        /** PluginConfig name */
        name?: (string|null);

        /** PluginConfig id */
        id?: (number|Long|null);

        /** PluginConfig version */
        version?: (number|Long|null);

        /** PluginConfig supportedTransactions */
        supportedTransactions?: (string[]|null);

        /** PluginConfig fileDescriptorProtos */
        fileDescriptorProtos?: (Uint8Array[]|null);

        /** PluginConfig transactionTypeUrls */
        transactionTypeUrls?: (string[]|null);

        /** PluginConfig eventTypeUrls */
        eventTypeUrls?: (string[]|null);
    }

    /** Represents a PluginConfig. */
    class PluginConfig implements IPluginConfig {

        /**
         * Constructs a new PluginConfig.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginConfig);

        /** PluginConfig name. */
        public name: string;

        /** PluginConfig id. */
        public id: (number|Long);

        /** PluginConfig version. */
        public version: (number|Long);

        /** PluginConfig supportedTransactions. */
        public supportedTransactions: string[];

        /** PluginConfig fileDescriptorProtos. */
        public fileDescriptorProtos: Uint8Array[];

        /** PluginConfig transactionTypeUrls. */
        public transactionTypeUrls: string[];

        /** PluginConfig eventTypeUrls. */
        public eventTypeUrls: string[];

        /**
         * Creates a new PluginConfig instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginConfig instance
         */
        public static create(properties?: types.IPluginConfig): types.PluginConfig;

        /**
         * Encodes the specified PluginConfig message. Does not implicitly {@link types.PluginConfig.verify|verify} messages.
         * @param message PluginConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginConfig message, length delimited. Does not implicitly {@link types.PluginConfig.verify|verify} messages.
         * @param message PluginConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginConfig message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginConfig;

        /**
         * Decodes a PluginConfig message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginConfig;

        /**
         * Verifies a PluginConfig message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginConfig message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginConfig
         */
        public static fromObject(object: { [k: string]: any }): types.PluginConfig;

        /**
         * Creates a plain object from a PluginConfig message. Also converts values to other types if specified.
         * @param message PluginConfig
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginConfig to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginConfig
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginFSMConfig. */
    interface IPluginFSMConfig {

        /** PluginFSMConfig config */
        config?: (types.IPluginConfig|null);
    }

    /** Represents a PluginFSMConfig. */
    class PluginFSMConfig implements IPluginFSMConfig {

        /**
         * Constructs a new PluginFSMConfig.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginFSMConfig);

        /** PluginFSMConfig config. */
        public config?: (types.IPluginConfig|null);

        /**
         * Creates a new PluginFSMConfig instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginFSMConfig instance
         */
        public static create(properties?: types.IPluginFSMConfig): types.PluginFSMConfig;

        /**
         * Encodes the specified PluginFSMConfig message. Does not implicitly {@link types.PluginFSMConfig.verify|verify} messages.
         * @param message PluginFSMConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginFSMConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginFSMConfig message, length delimited. Does not implicitly {@link types.PluginFSMConfig.verify|verify} messages.
         * @param message PluginFSMConfig message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginFSMConfig, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginFSMConfig message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginFSMConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginFSMConfig;

        /**
         * Decodes a PluginFSMConfig message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginFSMConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginFSMConfig;

        /**
         * Verifies a PluginFSMConfig message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginFSMConfig message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginFSMConfig
         */
        public static fromObject(object: { [k: string]: any }): types.PluginFSMConfig;

        /**
         * Creates a plain object from a PluginFSMConfig message. Also converts values to other types if specified.
         * @param message PluginFSMConfig
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginFSMConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginFSMConfig to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginFSMConfig
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginGenesisRequest. */
    interface IPluginGenesisRequest {

        /** PluginGenesisRequest genesisJson */
        genesisJson?: (Uint8Array|null);
    }

    /** Represents a PluginGenesisRequest. */
    class PluginGenesisRequest implements IPluginGenesisRequest {

        /**
         * Constructs a new PluginGenesisRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginGenesisRequest);

        /** PluginGenesisRequest genesisJson. */
        public genesisJson: Uint8Array;

        /**
         * Creates a new PluginGenesisRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginGenesisRequest instance
         */
        public static create(properties?: types.IPluginGenesisRequest): types.PluginGenesisRequest;

        /**
         * Encodes the specified PluginGenesisRequest message. Does not implicitly {@link types.PluginGenesisRequest.verify|verify} messages.
         * @param message PluginGenesisRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginGenesisRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginGenesisRequest message, length delimited. Does not implicitly {@link types.PluginGenesisRequest.verify|verify} messages.
         * @param message PluginGenesisRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginGenesisRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginGenesisRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginGenesisRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginGenesisRequest;

        /**
         * Decodes a PluginGenesisRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginGenesisRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginGenesisRequest;

        /**
         * Verifies a PluginGenesisRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginGenesisRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginGenesisRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginGenesisRequest;

        /**
         * Creates a plain object from a PluginGenesisRequest message. Also converts values to other types if specified.
         * @param message PluginGenesisRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginGenesisRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginGenesisRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginGenesisRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginGenesisResponse. */
    interface IPluginGenesisResponse {

        /** PluginGenesisResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginGenesisResponse. */
    class PluginGenesisResponse implements IPluginGenesisResponse {

        /**
         * Constructs a new PluginGenesisResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginGenesisResponse);

        /** PluginGenesisResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginGenesisResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginGenesisResponse instance
         */
        public static create(properties?: types.IPluginGenesisResponse): types.PluginGenesisResponse;

        /**
         * Encodes the specified PluginGenesisResponse message. Does not implicitly {@link types.PluginGenesisResponse.verify|verify} messages.
         * @param message PluginGenesisResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginGenesisResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginGenesisResponse message, length delimited. Does not implicitly {@link types.PluginGenesisResponse.verify|verify} messages.
         * @param message PluginGenesisResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginGenesisResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginGenesisResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginGenesisResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginGenesisResponse;

        /**
         * Decodes a PluginGenesisResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginGenesisResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginGenesisResponse;

        /**
         * Verifies a PluginGenesisResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginGenesisResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginGenesisResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginGenesisResponse;

        /**
         * Creates a plain object from a PluginGenesisResponse message. Also converts values to other types if specified.
         * @param message PluginGenesisResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginGenesisResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginGenesisResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginGenesisResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginBeginRequest. */
    interface IPluginBeginRequest {

        /** PluginBeginRequest height */
        height?: (number|Long|null);
    }

    /** Represents a PluginBeginRequest. */
    class PluginBeginRequest implements IPluginBeginRequest {

        /**
         * Constructs a new PluginBeginRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginBeginRequest);

        /** PluginBeginRequest height. */
        public height: (number|Long);

        /**
         * Creates a new PluginBeginRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginBeginRequest instance
         */
        public static create(properties?: types.IPluginBeginRequest): types.PluginBeginRequest;

        /**
         * Encodes the specified PluginBeginRequest message. Does not implicitly {@link types.PluginBeginRequest.verify|verify} messages.
         * @param message PluginBeginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginBeginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginBeginRequest message, length delimited. Does not implicitly {@link types.PluginBeginRequest.verify|verify} messages.
         * @param message PluginBeginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginBeginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginBeginRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginBeginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginBeginRequest;

        /**
         * Decodes a PluginBeginRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginBeginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginBeginRequest;

        /**
         * Verifies a PluginBeginRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginBeginRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginBeginRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginBeginRequest;

        /**
         * Creates a plain object from a PluginBeginRequest message. Also converts values to other types if specified.
         * @param message PluginBeginRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginBeginRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginBeginRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginBeginRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginBeginResponse. */
    interface IPluginBeginResponse {

        /** PluginBeginResponse events */
        events?: (types.IEvent[]|null);

        /** PluginBeginResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginBeginResponse. */
    class PluginBeginResponse implements IPluginBeginResponse {

        /**
         * Constructs a new PluginBeginResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginBeginResponse);

        /** PluginBeginResponse events. */
        public events: types.IEvent[];

        /** PluginBeginResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginBeginResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginBeginResponse instance
         */
        public static create(properties?: types.IPluginBeginResponse): types.PluginBeginResponse;

        /**
         * Encodes the specified PluginBeginResponse message. Does not implicitly {@link types.PluginBeginResponse.verify|verify} messages.
         * @param message PluginBeginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginBeginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginBeginResponse message, length delimited. Does not implicitly {@link types.PluginBeginResponse.verify|verify} messages.
         * @param message PluginBeginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginBeginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginBeginResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginBeginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginBeginResponse;

        /**
         * Decodes a PluginBeginResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginBeginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginBeginResponse;

        /**
         * Verifies a PluginBeginResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginBeginResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginBeginResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginBeginResponse;

        /**
         * Creates a plain object from a PluginBeginResponse message. Also converts values to other types if specified.
         * @param message PluginBeginResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginBeginResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginBeginResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginBeginResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginCheckRequest. */
    interface IPluginCheckRequest {

        /** PluginCheckRequest tx */
        tx?: (types.ITransaction|null);
    }

    /** Represents a PluginCheckRequest. */
    class PluginCheckRequest implements IPluginCheckRequest {

        /**
         * Constructs a new PluginCheckRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginCheckRequest);

        /** PluginCheckRequest tx. */
        public tx?: (types.ITransaction|null);

        /**
         * Creates a new PluginCheckRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginCheckRequest instance
         */
        public static create(properties?: types.IPluginCheckRequest): types.PluginCheckRequest;

        /**
         * Encodes the specified PluginCheckRequest message. Does not implicitly {@link types.PluginCheckRequest.verify|verify} messages.
         * @param message PluginCheckRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginCheckRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginCheckRequest message, length delimited. Does not implicitly {@link types.PluginCheckRequest.verify|verify} messages.
         * @param message PluginCheckRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginCheckRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginCheckRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginCheckRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginCheckRequest;

        /**
         * Decodes a PluginCheckRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginCheckRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginCheckRequest;

        /**
         * Verifies a PluginCheckRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginCheckRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginCheckRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginCheckRequest;

        /**
         * Creates a plain object from a PluginCheckRequest message. Also converts values to other types if specified.
         * @param message PluginCheckRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginCheckRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginCheckRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginCheckRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginCheckResponse. */
    interface IPluginCheckResponse {

        /** PluginCheckResponse authorizedSigners */
        authorizedSigners?: (Uint8Array[]|null);

        /** PluginCheckResponse recipient */
        recipient?: (Uint8Array|null);

        /** PluginCheckResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginCheckResponse. */
    class PluginCheckResponse implements IPluginCheckResponse {

        /**
         * Constructs a new PluginCheckResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginCheckResponse);

        /** PluginCheckResponse authorizedSigners. */
        public authorizedSigners: Uint8Array[];

        /** PluginCheckResponse recipient. */
        public recipient: Uint8Array;

        /** PluginCheckResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginCheckResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginCheckResponse instance
         */
        public static create(properties?: types.IPluginCheckResponse): types.PluginCheckResponse;

        /**
         * Encodes the specified PluginCheckResponse message. Does not implicitly {@link types.PluginCheckResponse.verify|verify} messages.
         * @param message PluginCheckResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginCheckResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginCheckResponse message, length delimited. Does not implicitly {@link types.PluginCheckResponse.verify|verify} messages.
         * @param message PluginCheckResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginCheckResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginCheckResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginCheckResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginCheckResponse;

        /**
         * Decodes a PluginCheckResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginCheckResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginCheckResponse;

        /**
         * Verifies a PluginCheckResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginCheckResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginCheckResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginCheckResponse;

        /**
         * Creates a plain object from a PluginCheckResponse message. Also converts values to other types if specified.
         * @param message PluginCheckResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginCheckResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginCheckResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginCheckResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginDeliverRequest. */
    interface IPluginDeliverRequest {

        /** PluginDeliverRequest tx */
        tx?: (types.ITransaction|null);
    }

    /** Represents a PluginDeliverRequest. */
    class PluginDeliverRequest implements IPluginDeliverRequest {

        /**
         * Constructs a new PluginDeliverRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginDeliverRequest);

        /** PluginDeliverRequest tx. */
        public tx?: (types.ITransaction|null);

        /**
         * Creates a new PluginDeliverRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginDeliverRequest instance
         */
        public static create(properties?: types.IPluginDeliverRequest): types.PluginDeliverRequest;

        /**
         * Encodes the specified PluginDeliverRequest message. Does not implicitly {@link types.PluginDeliverRequest.verify|verify} messages.
         * @param message PluginDeliverRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginDeliverRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginDeliverRequest message, length delimited. Does not implicitly {@link types.PluginDeliverRequest.verify|verify} messages.
         * @param message PluginDeliverRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginDeliverRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginDeliverRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginDeliverRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginDeliverRequest;

        /**
         * Decodes a PluginDeliverRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginDeliverRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginDeliverRequest;

        /**
         * Verifies a PluginDeliverRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginDeliverRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginDeliverRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginDeliverRequest;

        /**
         * Creates a plain object from a PluginDeliverRequest message. Also converts values to other types if specified.
         * @param message PluginDeliverRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginDeliverRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginDeliverRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginDeliverRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginDeliverResponse. */
    interface IPluginDeliverResponse {

        /** PluginDeliverResponse events */
        events?: (types.IEvent[]|null);

        /** PluginDeliverResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginDeliverResponse. */
    class PluginDeliverResponse implements IPluginDeliverResponse {

        /**
         * Constructs a new PluginDeliverResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginDeliverResponse);

        /** PluginDeliverResponse events. */
        public events: types.IEvent[];

        /** PluginDeliverResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginDeliverResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginDeliverResponse instance
         */
        public static create(properties?: types.IPluginDeliverResponse): types.PluginDeliverResponse;

        /**
         * Encodes the specified PluginDeliverResponse message. Does not implicitly {@link types.PluginDeliverResponse.verify|verify} messages.
         * @param message PluginDeliverResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginDeliverResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginDeliverResponse message, length delimited. Does not implicitly {@link types.PluginDeliverResponse.verify|verify} messages.
         * @param message PluginDeliverResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginDeliverResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginDeliverResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginDeliverResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginDeliverResponse;

        /**
         * Decodes a PluginDeliverResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginDeliverResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginDeliverResponse;

        /**
         * Verifies a PluginDeliverResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginDeliverResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginDeliverResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginDeliverResponse;

        /**
         * Creates a plain object from a PluginDeliverResponse message. Also converts values to other types if specified.
         * @param message PluginDeliverResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginDeliverResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginDeliverResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginDeliverResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginEndRequest. */
    interface IPluginEndRequest {

        /** PluginEndRequest height */
        height?: (number|Long|null);

        /** PluginEndRequest proposerAddress */
        proposerAddress?: (Uint8Array|null);
    }

    /** Represents a PluginEndRequest. */
    class PluginEndRequest implements IPluginEndRequest {

        /**
         * Constructs a new PluginEndRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginEndRequest);

        /** PluginEndRequest height. */
        public height: (number|Long);

        /** PluginEndRequest proposerAddress. */
        public proposerAddress: Uint8Array;

        /**
         * Creates a new PluginEndRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginEndRequest instance
         */
        public static create(properties?: types.IPluginEndRequest): types.PluginEndRequest;

        /**
         * Encodes the specified PluginEndRequest message. Does not implicitly {@link types.PluginEndRequest.verify|verify} messages.
         * @param message PluginEndRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginEndRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginEndRequest message, length delimited. Does not implicitly {@link types.PluginEndRequest.verify|verify} messages.
         * @param message PluginEndRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginEndRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginEndRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginEndRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginEndRequest;

        /**
         * Decodes a PluginEndRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginEndRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginEndRequest;

        /**
         * Verifies a PluginEndRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginEndRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginEndRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginEndRequest;

        /**
         * Creates a plain object from a PluginEndRequest message. Also converts values to other types if specified.
         * @param message PluginEndRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginEndRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginEndRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginEndRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginEndResponse. */
    interface IPluginEndResponse {

        /** PluginEndResponse events */
        events?: (types.IEvent[]|null);

        /** PluginEndResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginEndResponse. */
    class PluginEndResponse implements IPluginEndResponse {

        /**
         * Constructs a new PluginEndResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginEndResponse);

        /** PluginEndResponse events. */
        public events: types.IEvent[];

        /** PluginEndResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginEndResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginEndResponse instance
         */
        public static create(properties?: types.IPluginEndResponse): types.PluginEndResponse;

        /**
         * Encodes the specified PluginEndResponse message. Does not implicitly {@link types.PluginEndResponse.verify|verify} messages.
         * @param message PluginEndResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginEndResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginEndResponse message, length delimited. Does not implicitly {@link types.PluginEndResponse.verify|verify} messages.
         * @param message PluginEndResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginEndResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginEndResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginEndResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginEndResponse;

        /**
         * Decodes a PluginEndResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginEndResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginEndResponse;

        /**
         * Verifies a PluginEndResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginEndResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginEndResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginEndResponse;

        /**
         * Creates a plain object from a PluginEndResponse message. Also converts values to other types if specified.
         * @param message PluginEndResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginEndResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginEndResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginEndResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginError. */
    interface IPluginError {

        /** PluginError code */
        code?: (number|Long|null);

        /** PluginError module */
        module?: (string|null);

        /** PluginError msg */
        msg?: (string|null);
    }

    /** Represents a PluginError. */
    class PluginError implements IPluginError {

        /**
         * Constructs a new PluginError.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginError);

        /** PluginError code. */
        public code: (number|Long);

        /** PluginError module. */
        public module: string;

        /** PluginError msg. */
        public msg: string;

        /**
         * Creates a new PluginError instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginError instance
         */
        public static create(properties?: types.IPluginError): types.PluginError;

        /**
         * Encodes the specified PluginError message. Does not implicitly {@link types.PluginError.verify|verify} messages.
         * @param message PluginError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginError message, length delimited. Does not implicitly {@link types.PluginError.verify|verify} messages.
         * @param message PluginError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginError message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginError;

        /**
         * Decodes a PluginError message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginError;

        /**
         * Verifies a PluginError message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginError message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginError
         */
        public static fromObject(object: { [k: string]: any }): types.PluginError;

        /**
         * Creates a plain object from a PluginError message. Also converts values to other types if specified.
         * @param message PluginError
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginError, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginError to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginError
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateReadRequest. */
    interface IPluginStateReadRequest {

        /** PluginStateReadRequest keys */
        keys?: (types.IPluginKeyRead[]|null);

        /** PluginStateReadRequest ranges */
        ranges?: (types.IPluginRangeRead[]|null);
    }

    /** Represents a PluginStateReadRequest. */
    class PluginStateReadRequest implements IPluginStateReadRequest {

        /**
         * Constructs a new PluginStateReadRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateReadRequest);

        /** PluginStateReadRequest keys. */
        public keys: types.IPluginKeyRead[];

        /** PluginStateReadRequest ranges. */
        public ranges: types.IPluginRangeRead[];

        /**
         * Creates a new PluginStateReadRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateReadRequest instance
         */
        public static create(properties?: types.IPluginStateReadRequest): types.PluginStateReadRequest;

        /**
         * Encodes the specified PluginStateReadRequest message. Does not implicitly {@link types.PluginStateReadRequest.verify|verify} messages.
         * @param message PluginStateReadRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateReadRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateReadRequest message, length delimited. Does not implicitly {@link types.PluginStateReadRequest.verify|verify} messages.
         * @param message PluginStateReadRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateReadRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateReadRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateReadRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateReadRequest;

        /**
         * Decodes a PluginStateReadRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateReadRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateReadRequest;

        /**
         * Verifies a PluginStateReadRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateReadRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateReadRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateReadRequest;

        /**
         * Creates a plain object from a PluginStateReadRequest message. Also converts values to other types if specified.
         * @param message PluginStateReadRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateReadRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateReadRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateReadRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginKeyRead. */
    interface IPluginKeyRead {

        /** PluginKeyRead queryId */
        queryId?: (number|Long|null);

        /** PluginKeyRead key */
        key?: (Uint8Array|null);
    }

    /** Represents a PluginKeyRead. */
    class PluginKeyRead implements IPluginKeyRead {

        /**
         * Constructs a new PluginKeyRead.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginKeyRead);

        /** PluginKeyRead queryId. */
        public queryId: (number|Long);

        /** PluginKeyRead key. */
        public key: Uint8Array;

        /**
         * Creates a new PluginKeyRead instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginKeyRead instance
         */
        public static create(properties?: types.IPluginKeyRead): types.PluginKeyRead;

        /**
         * Encodes the specified PluginKeyRead message. Does not implicitly {@link types.PluginKeyRead.verify|verify} messages.
         * @param message PluginKeyRead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginKeyRead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginKeyRead message, length delimited. Does not implicitly {@link types.PluginKeyRead.verify|verify} messages.
         * @param message PluginKeyRead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginKeyRead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginKeyRead message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginKeyRead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginKeyRead;

        /**
         * Decodes a PluginKeyRead message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginKeyRead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginKeyRead;

        /**
         * Verifies a PluginKeyRead message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginKeyRead message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginKeyRead
         */
        public static fromObject(object: { [k: string]: any }): types.PluginKeyRead;

        /**
         * Creates a plain object from a PluginKeyRead message. Also converts values to other types if specified.
         * @param message PluginKeyRead
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginKeyRead, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginKeyRead to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginKeyRead
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginRangeRead. */
    interface IPluginRangeRead {

        /** PluginRangeRead queryId */
        queryId?: (number|Long|null);

        /** PluginRangeRead prefix */
        prefix?: (Uint8Array|null);

        /** PluginRangeRead limit */
        limit?: (number|Long|null);

        /** PluginRangeRead reverse */
        reverse?: (boolean|null);
    }

    /** Represents a PluginRangeRead. */
    class PluginRangeRead implements IPluginRangeRead {

        /**
         * Constructs a new PluginRangeRead.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginRangeRead);

        /** PluginRangeRead queryId. */
        public queryId: (number|Long);

        /** PluginRangeRead prefix. */
        public prefix: Uint8Array;

        /** PluginRangeRead limit. */
        public limit: (number|Long);

        /** PluginRangeRead reverse. */
        public reverse: boolean;

        /**
         * Creates a new PluginRangeRead instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginRangeRead instance
         */
        public static create(properties?: types.IPluginRangeRead): types.PluginRangeRead;

        /**
         * Encodes the specified PluginRangeRead message. Does not implicitly {@link types.PluginRangeRead.verify|verify} messages.
         * @param message PluginRangeRead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginRangeRead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginRangeRead message, length delimited. Does not implicitly {@link types.PluginRangeRead.verify|verify} messages.
         * @param message PluginRangeRead message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginRangeRead, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginRangeRead message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginRangeRead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginRangeRead;

        /**
         * Decodes a PluginRangeRead message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginRangeRead
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginRangeRead;

        /**
         * Verifies a PluginRangeRead message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginRangeRead message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginRangeRead
         */
        public static fromObject(object: { [k: string]: any }): types.PluginRangeRead;

        /**
         * Creates a plain object from a PluginRangeRead message. Also converts values to other types if specified.
         * @param message PluginRangeRead
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginRangeRead, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginRangeRead to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginRangeRead
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateReadResponse. */
    interface IPluginStateReadResponse {

        /** PluginStateReadResponse results */
        results?: (types.IPluginReadResult[]|null);

        /** PluginStateReadResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginStateReadResponse. */
    class PluginStateReadResponse implements IPluginStateReadResponse {

        /**
         * Constructs a new PluginStateReadResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateReadResponse);

        /** PluginStateReadResponse results. */
        public results: types.IPluginReadResult[];

        /** PluginStateReadResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginStateReadResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateReadResponse instance
         */
        public static create(properties?: types.IPluginStateReadResponse): types.PluginStateReadResponse;

        /**
         * Encodes the specified PluginStateReadResponse message. Does not implicitly {@link types.PluginStateReadResponse.verify|verify} messages.
         * @param message PluginStateReadResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateReadResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateReadResponse message, length delimited. Does not implicitly {@link types.PluginStateReadResponse.verify|verify} messages.
         * @param message PluginStateReadResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateReadResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateReadResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateReadResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateReadResponse;

        /**
         * Decodes a PluginStateReadResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateReadResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateReadResponse;

        /**
         * Verifies a PluginStateReadResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateReadResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateReadResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateReadResponse;

        /**
         * Creates a plain object from a PluginStateReadResponse message. Also converts values to other types if specified.
         * @param message PluginStateReadResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateReadResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateReadResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateReadResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginReadResult. */
    interface IPluginReadResult {

        /** PluginReadResult queryId */
        queryId?: (number|Long|null);

        /** PluginReadResult entries */
        entries?: (types.IPluginStateEntry[]|null);
    }

    /** Represents a PluginReadResult. */
    class PluginReadResult implements IPluginReadResult {

        /**
         * Constructs a new PluginReadResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginReadResult);

        /** PluginReadResult queryId. */
        public queryId: (number|Long);

        /** PluginReadResult entries. */
        public entries: types.IPluginStateEntry[];

        /**
         * Creates a new PluginReadResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginReadResult instance
         */
        public static create(properties?: types.IPluginReadResult): types.PluginReadResult;

        /**
         * Encodes the specified PluginReadResult message. Does not implicitly {@link types.PluginReadResult.verify|verify} messages.
         * @param message PluginReadResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginReadResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginReadResult message, length delimited. Does not implicitly {@link types.PluginReadResult.verify|verify} messages.
         * @param message PluginReadResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginReadResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginReadResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginReadResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginReadResult;

        /**
         * Decodes a PluginReadResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginReadResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginReadResult;

        /**
         * Verifies a PluginReadResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginReadResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginReadResult
         */
        public static fromObject(object: { [k: string]: any }): types.PluginReadResult;

        /**
         * Creates a plain object from a PluginReadResult message. Also converts values to other types if specified.
         * @param message PluginReadResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginReadResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginReadResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginReadResult
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateWriteRequest. */
    interface IPluginStateWriteRequest {

        /** PluginStateWriteRequest sets */
        sets?: (types.IPluginSetOp[]|null);

        /** PluginStateWriteRequest deletes */
        deletes?: (types.IPluginDeleteOp[]|null);
    }

    /** Represents a PluginStateWriteRequest. */
    class PluginStateWriteRequest implements IPluginStateWriteRequest {

        /**
         * Constructs a new PluginStateWriteRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateWriteRequest);

        /** PluginStateWriteRequest sets. */
        public sets: types.IPluginSetOp[];

        /** PluginStateWriteRequest deletes. */
        public deletes: types.IPluginDeleteOp[];

        /**
         * Creates a new PluginStateWriteRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateWriteRequest instance
         */
        public static create(properties?: types.IPluginStateWriteRequest): types.PluginStateWriteRequest;

        /**
         * Encodes the specified PluginStateWriteRequest message. Does not implicitly {@link types.PluginStateWriteRequest.verify|verify} messages.
         * @param message PluginStateWriteRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateWriteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateWriteRequest message, length delimited. Does not implicitly {@link types.PluginStateWriteRequest.verify|verify} messages.
         * @param message PluginStateWriteRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateWriteRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateWriteRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateWriteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateWriteRequest;

        /**
         * Decodes a PluginStateWriteRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateWriteRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateWriteRequest;

        /**
         * Verifies a PluginStateWriteRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateWriteRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateWriteRequest
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateWriteRequest;

        /**
         * Creates a plain object from a PluginStateWriteRequest message. Also converts values to other types if specified.
         * @param message PluginStateWriteRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateWriteRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateWriteRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateWriteRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateWriteResponse. */
    interface IPluginStateWriteResponse {

        /** PluginStateWriteResponse error */
        error?: (types.IPluginError|null);
    }

    /** Represents a PluginStateWriteResponse. */
    class PluginStateWriteResponse implements IPluginStateWriteResponse {

        /**
         * Constructs a new PluginStateWriteResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateWriteResponse);

        /** PluginStateWriteResponse error. */
        public error?: (types.IPluginError|null);

        /**
         * Creates a new PluginStateWriteResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateWriteResponse instance
         */
        public static create(properties?: types.IPluginStateWriteResponse): types.PluginStateWriteResponse;

        /**
         * Encodes the specified PluginStateWriteResponse message. Does not implicitly {@link types.PluginStateWriteResponse.verify|verify} messages.
         * @param message PluginStateWriteResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateWriteResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateWriteResponse message, length delimited. Does not implicitly {@link types.PluginStateWriteResponse.verify|verify} messages.
         * @param message PluginStateWriteResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateWriteResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateWriteResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateWriteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateWriteResponse;

        /**
         * Decodes a PluginStateWriteResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateWriteResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateWriteResponse;

        /**
         * Verifies a PluginStateWriteResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateWriteResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateWriteResponse
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateWriteResponse;

        /**
         * Creates a plain object from a PluginStateWriteResponse message. Also converts values to other types if specified.
         * @param message PluginStateWriteResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateWriteResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateWriteResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateWriteResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginSetOp. */
    interface IPluginSetOp {

        /** PluginSetOp key */
        key?: (Uint8Array|null);

        /** PluginSetOp value */
        value?: (Uint8Array|null);
    }

    /** Represents a PluginSetOp. */
    class PluginSetOp implements IPluginSetOp {

        /**
         * Constructs a new PluginSetOp.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginSetOp);

        /** PluginSetOp key. */
        public key: Uint8Array;

        /** PluginSetOp value. */
        public value: Uint8Array;

        /**
         * Creates a new PluginSetOp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginSetOp instance
         */
        public static create(properties?: types.IPluginSetOp): types.PluginSetOp;

        /**
         * Encodes the specified PluginSetOp message. Does not implicitly {@link types.PluginSetOp.verify|verify} messages.
         * @param message PluginSetOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginSetOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginSetOp message, length delimited. Does not implicitly {@link types.PluginSetOp.verify|verify} messages.
         * @param message PluginSetOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginSetOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginSetOp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginSetOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginSetOp;

        /**
         * Decodes a PluginSetOp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginSetOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginSetOp;

        /**
         * Verifies a PluginSetOp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginSetOp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginSetOp
         */
        public static fromObject(object: { [k: string]: any }): types.PluginSetOp;

        /**
         * Creates a plain object from a PluginSetOp message. Also converts values to other types if specified.
         * @param message PluginSetOp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginSetOp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginSetOp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginSetOp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginDeleteOp. */
    interface IPluginDeleteOp {

        /** PluginDeleteOp key */
        key?: (Uint8Array|null);
    }

    /** Represents a PluginDeleteOp. */
    class PluginDeleteOp implements IPluginDeleteOp {

        /**
         * Constructs a new PluginDeleteOp.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginDeleteOp);

        /** PluginDeleteOp key. */
        public key: Uint8Array;

        /**
         * Creates a new PluginDeleteOp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginDeleteOp instance
         */
        public static create(properties?: types.IPluginDeleteOp): types.PluginDeleteOp;

        /**
         * Encodes the specified PluginDeleteOp message. Does not implicitly {@link types.PluginDeleteOp.verify|verify} messages.
         * @param message PluginDeleteOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginDeleteOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginDeleteOp message, length delimited. Does not implicitly {@link types.PluginDeleteOp.verify|verify} messages.
         * @param message PluginDeleteOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginDeleteOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginDeleteOp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginDeleteOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginDeleteOp;

        /**
         * Decodes a PluginDeleteOp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginDeleteOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginDeleteOp;

        /**
         * Verifies a PluginDeleteOp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginDeleteOp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginDeleteOp
         */
        public static fromObject(object: { [k: string]: any }): types.PluginDeleteOp;

        /**
         * Creates a plain object from a PluginDeleteOp message. Also converts values to other types if specified.
         * @param message PluginDeleteOp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginDeleteOp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginDeleteOp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginDeleteOp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PluginStateEntry. */
    interface IPluginStateEntry {

        /** PluginStateEntry key */
        key?: (Uint8Array|null);

        /** PluginStateEntry value */
        value?: (Uint8Array|null);
    }

    /** Represents a PluginStateEntry. */
    class PluginStateEntry implements IPluginStateEntry {

        /**
         * Constructs a new PluginStateEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IPluginStateEntry);

        /** PluginStateEntry key. */
        public key: Uint8Array;

        /** PluginStateEntry value. */
        public value: Uint8Array;

        /**
         * Creates a new PluginStateEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PluginStateEntry instance
         */
        public static create(properties?: types.IPluginStateEntry): types.PluginStateEntry;

        /**
         * Encodes the specified PluginStateEntry message. Does not implicitly {@link types.PluginStateEntry.verify|verify} messages.
         * @param message PluginStateEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IPluginStateEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PluginStateEntry message, length delimited. Does not implicitly {@link types.PluginStateEntry.verify|verify} messages.
         * @param message PluginStateEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IPluginStateEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PluginStateEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PluginStateEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.PluginStateEntry;

        /**
         * Decodes a PluginStateEntry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PluginStateEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.PluginStateEntry;

        /**
         * Verifies a PluginStateEntry message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PluginStateEntry message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PluginStateEntry
         */
        public static fromObject(object: { [k: string]: any }): types.PluginStateEntry;

        /**
         * Creates a plain object from a PluginStateEntry message. Also converts values to other types if specified.
         * @param message PluginStateEntry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.PluginStateEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PluginStateEntry to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PluginStateEntry
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Transaction. */
    interface ITransaction {

        /** Transaction messageType */
        messageType?: (string|null);

        /** Transaction msg */
        msg?: (google.protobuf.IAny|null);

        /** Transaction signature */
        signature?: (types.ISignature|null);

        /** Transaction createdHeight */
        createdHeight?: (number|Long|null);

        /** Transaction time */
        time?: (number|Long|null);

        /** Transaction fee */
        fee?: (number|Long|null);

        /** Transaction memo */
        memo?: (string|null);

        /** Transaction networkId */
        networkId?: (number|Long|null);

        /** Transaction chainId */
        chainId?: (number|Long|null);
    }

    /** Represents a Transaction. */
    class Transaction implements ITransaction {

        /**
         * Constructs a new Transaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.ITransaction);

        /** Transaction messageType. */
        public messageType: string;

        /** Transaction msg. */
        public msg?: (google.protobuf.IAny|null);

        /** Transaction signature. */
        public signature?: (types.ISignature|null);

        /** Transaction createdHeight. */
        public createdHeight: (number|Long);

        /** Transaction time. */
        public time: (number|Long);

        /** Transaction fee. */
        public fee: (number|Long);

        /** Transaction memo. */
        public memo: string;

        /** Transaction networkId. */
        public networkId: (number|Long);

        /** Transaction chainId. */
        public chainId: (number|Long);

        /**
         * Creates a new Transaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transaction instance
         */
        public static create(properties?: types.ITransaction): types.Transaction;

        /**
         * Encodes the specified Transaction message. Does not implicitly {@link types.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transaction message, length delimited. Does not implicitly {@link types.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Transaction;

        /**
         * Decodes a Transaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Transaction;

        /**
         * Verifies a Transaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transaction
         */
        public static fromObject(object: { [k: string]: any }): types.Transaction;

        /**
         * Creates a plain object from a Transaction message. Also converts values to other types if specified.
         * @param message Transaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Transaction
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageSend. */
    interface IMessageSend {

        /** MessageSend fromAddress */
        fromAddress?: (Uint8Array|null);

        /** MessageSend toAddress */
        toAddress?: (Uint8Array|null);

        /** MessageSend amount */
        amount?: (number|Long|null);
    }

    /** Represents a MessageSend. */
    class MessageSend implements IMessageSend {

        /**
         * Constructs a new MessageSend.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageSend);

        /** MessageSend fromAddress. */
        public fromAddress: Uint8Array;

        /** MessageSend toAddress. */
        public toAddress: Uint8Array;

        /** MessageSend amount. */
        public amount: (number|Long);

        /**
         * Creates a new MessageSend instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageSend instance
         */
        public static create(properties?: types.IMessageSend): types.MessageSend;

        /**
         * Encodes the specified MessageSend message. Does not implicitly {@link types.MessageSend.verify|verify} messages.
         * @param message MessageSend message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageSend, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageSend message, length delimited. Does not implicitly {@link types.MessageSend.verify|verify} messages.
         * @param message MessageSend message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageSend, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageSend message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageSend
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageSend;

        /**
         * Decodes a MessageSend message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageSend
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageSend;

        /**
         * Verifies a MessageSend message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageSend message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageSend
         */
        public static fromObject(object: { [k: string]: any }): types.MessageSend;

        /**
         * Creates a plain object from a MessageSend message. Also converts values to other types if specified.
         * @param message MessageSend
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageSend, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageSend to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageSend
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FeeParams. */
    interface IFeeParams {

        /** FeeParams sendFee */
        sendFee?: (number|Long|null);
    }

    /** Represents a FeeParams. */
    class FeeParams implements IFeeParams {

        /**
         * Constructs a new FeeParams.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IFeeParams);

        /** FeeParams sendFee. */
        public sendFee: (number|Long);

        /**
         * Creates a new FeeParams instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FeeParams instance
         */
        public static create(properties?: types.IFeeParams): types.FeeParams;

        /**
         * Encodes the specified FeeParams message. Does not implicitly {@link types.FeeParams.verify|verify} messages.
         * @param message FeeParams message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IFeeParams, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FeeParams message, length delimited. Does not implicitly {@link types.FeeParams.verify|verify} messages.
         * @param message FeeParams message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IFeeParams, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FeeParams message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FeeParams
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.FeeParams;

        /**
         * Decodes a FeeParams message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FeeParams
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.FeeParams;

        /**
         * Verifies a FeeParams message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FeeParams message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FeeParams
         */
        public static fromObject(object: { [k: string]: any }): types.FeeParams;

        /**
         * Creates a plain object from a FeeParams message. Also converts values to other types if specified.
         * @param message FeeParams
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.FeeParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FeeParams to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FeeParams
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Signature. */
    interface ISignature {

        /** Signature publicKey */
        publicKey?: (Uint8Array|null);

        /** Signature signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a Signature. */
    class Signature implements ISignature {

        /**
         * Constructs a new Signature.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.ISignature);

        /** Signature publicKey. */
        public publicKey: Uint8Array;

        /** Signature signature. */
        public signature: Uint8Array;

        /**
         * Creates a new Signature instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Signature instance
         */
        public static create(properties?: types.ISignature): types.Signature;

        /**
         * Encodes the specified Signature message. Does not implicitly {@link types.Signature.verify|verify} messages.
         * @param message Signature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.ISignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Signature message, length delimited. Does not implicitly {@link types.Signature.verify|verify} messages.
         * @param message Signature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.ISignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Signature message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Signature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.Signature;

        /**
         * Decodes a Signature message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Signature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.Signature;

        /**
         * Verifies a Signature message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Signature message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Signature
         */
        public static fromObject(object: { [k: string]: any }): types.Signature;

        /**
         * Creates a plain object from a Signature message. Also converts values to other types if specified.
         * @param message Signature
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.Signature, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Signature to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Signature
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageCreateProfile. */
    interface IMessageCreateProfile {

        /** MessageCreateProfile address */
        address?: (Uint8Array|null);

        /** MessageCreateProfile username */
        username?: (string|null);

        /** MessageCreateProfile bio */
        bio?: (string|null);

        /** MessageCreateProfile expertiseTags */
        expertiseTags?: (string[]|null);
    }

    /** Represents a MessageCreateProfile. */
    class MessageCreateProfile implements IMessageCreateProfile {

        /**
         * Constructs a new MessageCreateProfile.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageCreateProfile);

        /** MessageCreateProfile address. */
        public address: Uint8Array;

        /** MessageCreateProfile username. */
        public username: string;

        /** MessageCreateProfile bio. */
        public bio: string;

        /** MessageCreateProfile expertiseTags. */
        public expertiseTags: string[];

        /**
         * Creates a new MessageCreateProfile instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageCreateProfile instance
         */
        public static create(properties?: types.IMessageCreateProfile): types.MessageCreateProfile;

        /**
         * Encodes the specified MessageCreateProfile message. Does not implicitly {@link types.MessageCreateProfile.verify|verify} messages.
         * @param message MessageCreateProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageCreateProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageCreateProfile message, length delimited. Does not implicitly {@link types.MessageCreateProfile.verify|verify} messages.
         * @param message MessageCreateProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageCreateProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageCreateProfile message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageCreateProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageCreateProfile;

        /**
         * Decodes a MessageCreateProfile message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageCreateProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageCreateProfile;

        /**
         * Verifies a MessageCreateProfile message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageCreateProfile message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageCreateProfile
         */
        public static fromObject(object: { [k: string]: any }): types.MessageCreateProfile;

        /**
         * Creates a plain object from a MessageCreateProfile message. Also converts values to other types if specified.
         * @param message MessageCreateProfile
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageCreateProfile, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageCreateProfile to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageCreateProfile
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageUpdateProfile. */
    interface IMessageUpdateProfile {

        /** MessageUpdateProfile address */
        address?: (Uint8Array|null);

        /** MessageUpdateProfile bio */
        bio?: (string|null);

        /** MessageUpdateProfile expertiseTags */
        expertiseTags?: (string[]|null);
    }

    /** Represents a MessageUpdateProfile. */
    class MessageUpdateProfile implements IMessageUpdateProfile {

        /**
         * Constructs a new MessageUpdateProfile.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageUpdateProfile);

        /** MessageUpdateProfile address. */
        public address: Uint8Array;

        /** MessageUpdateProfile bio. */
        public bio: string;

        /** MessageUpdateProfile expertiseTags. */
        public expertiseTags: string[];

        /**
         * Creates a new MessageUpdateProfile instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageUpdateProfile instance
         */
        public static create(properties?: types.IMessageUpdateProfile): types.MessageUpdateProfile;

        /**
         * Encodes the specified MessageUpdateProfile message. Does not implicitly {@link types.MessageUpdateProfile.verify|verify} messages.
         * @param message MessageUpdateProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageUpdateProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageUpdateProfile message, length delimited. Does not implicitly {@link types.MessageUpdateProfile.verify|verify} messages.
         * @param message MessageUpdateProfile message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageUpdateProfile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageUpdateProfile message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageUpdateProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageUpdateProfile;

        /**
         * Decodes a MessageUpdateProfile message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageUpdateProfile
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageUpdateProfile;

        /**
         * Verifies a MessageUpdateProfile message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageUpdateProfile message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageUpdateProfile
         */
        public static fromObject(object: { [k: string]: any }): types.MessageUpdateProfile;

        /**
         * Creates a plain object from a MessageUpdateProfile message. Also converts values to other types if specified.
         * @param message MessageUpdateProfile
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageUpdateProfile, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageUpdateProfile to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageUpdateProfile
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageCreateQuestion. */
    interface IMessageCreateQuestion {

        /** MessageCreateQuestion authorAddress */
        authorAddress?: (Uint8Array|null);

        /** MessageCreateQuestion title */
        title?: (string|null);

        /** MessageCreateQuestion contentHash */
        contentHash?: (string|null);

        /** MessageCreateQuestion category */
        category?: (string|null);

        /** MessageCreateQuestion tags */
        tags?: (string[]|null);
    }

    /** Represents a MessageCreateQuestion. */
    class MessageCreateQuestion implements IMessageCreateQuestion {

        /**
         * Constructs a new MessageCreateQuestion.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageCreateQuestion);

        /** MessageCreateQuestion authorAddress. */
        public authorAddress: Uint8Array;

        /** MessageCreateQuestion title. */
        public title: string;

        /** MessageCreateQuestion contentHash. */
        public contentHash: string;

        /** MessageCreateQuestion category. */
        public category: string;

        /** MessageCreateQuestion tags. */
        public tags: string[];

        /**
         * Creates a new MessageCreateQuestion instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageCreateQuestion instance
         */
        public static create(properties?: types.IMessageCreateQuestion): types.MessageCreateQuestion;

        /**
         * Encodes the specified MessageCreateQuestion message. Does not implicitly {@link types.MessageCreateQuestion.verify|verify} messages.
         * @param message MessageCreateQuestion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageCreateQuestion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageCreateQuestion message, length delimited. Does not implicitly {@link types.MessageCreateQuestion.verify|verify} messages.
         * @param message MessageCreateQuestion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageCreateQuestion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageCreateQuestion message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageCreateQuestion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageCreateQuestion;

        /**
         * Decodes a MessageCreateQuestion message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageCreateQuestion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageCreateQuestion;

        /**
         * Verifies a MessageCreateQuestion message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageCreateQuestion message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageCreateQuestion
         */
        public static fromObject(object: { [k: string]: any }): types.MessageCreateQuestion;

        /**
         * Creates a plain object from a MessageCreateQuestion message. Also converts values to other types if specified.
         * @param message MessageCreateQuestion
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageCreateQuestion, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageCreateQuestion to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageCreateQuestion
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageSubmitAnswer. */
    interface IMessageSubmitAnswer {

        /** MessageSubmitAnswer authorAddress */
        authorAddress?: (Uint8Array|null);

        /** MessageSubmitAnswer questionId */
        questionId?: (string|null);

        /** MessageSubmitAnswer contentHash */
        contentHash?: (string|null);

        /** MessageSubmitAnswer stakeAmount */
        stakeAmount?: (number|Long|null);
    }

    /** Represents a MessageSubmitAnswer. */
    class MessageSubmitAnswer implements IMessageSubmitAnswer {

        /**
         * Constructs a new MessageSubmitAnswer.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageSubmitAnswer);

        /** MessageSubmitAnswer authorAddress. */
        public authorAddress: Uint8Array;

        /** MessageSubmitAnswer questionId. */
        public questionId: string;

        /** MessageSubmitAnswer contentHash. */
        public contentHash: string;

        /** MessageSubmitAnswer stakeAmount. */
        public stakeAmount: (number|Long);

        /**
         * Creates a new MessageSubmitAnswer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageSubmitAnswer instance
         */
        public static create(properties?: types.IMessageSubmitAnswer): types.MessageSubmitAnswer;

        /**
         * Encodes the specified MessageSubmitAnswer message. Does not implicitly {@link types.MessageSubmitAnswer.verify|verify} messages.
         * @param message MessageSubmitAnswer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageSubmitAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageSubmitAnswer message, length delimited. Does not implicitly {@link types.MessageSubmitAnswer.verify|verify} messages.
         * @param message MessageSubmitAnswer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageSubmitAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageSubmitAnswer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageSubmitAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageSubmitAnswer;

        /**
         * Decodes a MessageSubmitAnswer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageSubmitAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageSubmitAnswer;

        /**
         * Verifies a MessageSubmitAnswer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageSubmitAnswer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageSubmitAnswer
         */
        public static fromObject(object: { [k: string]: any }): types.MessageSubmitAnswer;

        /**
         * Creates a plain object from a MessageSubmitAnswer message. Also converts values to other types if specified.
         * @param message MessageSubmitAnswer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageSubmitAnswer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageSubmitAnswer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageSubmitAnswer
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageAcceptAnswer. */
    interface IMessageAcceptAnswer {

        /** MessageAcceptAnswer ownerAddress */
        ownerAddress?: (Uint8Array|null);

        /** MessageAcceptAnswer questionId */
        questionId?: (string|null);

        /** MessageAcceptAnswer answerId */
        answerId?: (string|null);
    }

    /** Represents a MessageAcceptAnswer. */
    class MessageAcceptAnswer implements IMessageAcceptAnswer {

        /**
         * Constructs a new MessageAcceptAnswer.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageAcceptAnswer);

        /** MessageAcceptAnswer ownerAddress. */
        public ownerAddress: Uint8Array;

        /** MessageAcceptAnswer questionId. */
        public questionId: string;

        /** MessageAcceptAnswer answerId. */
        public answerId: string;

        /**
         * Creates a new MessageAcceptAnswer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageAcceptAnswer instance
         */
        public static create(properties?: types.IMessageAcceptAnswer): types.MessageAcceptAnswer;

        /**
         * Encodes the specified MessageAcceptAnswer message. Does not implicitly {@link types.MessageAcceptAnswer.verify|verify} messages.
         * @param message MessageAcceptAnswer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageAcceptAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageAcceptAnswer message, length delimited. Does not implicitly {@link types.MessageAcceptAnswer.verify|verify} messages.
         * @param message MessageAcceptAnswer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageAcceptAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageAcceptAnswer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageAcceptAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageAcceptAnswer;

        /**
         * Decodes a MessageAcceptAnswer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageAcceptAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageAcceptAnswer;

        /**
         * Verifies a MessageAcceptAnswer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageAcceptAnswer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageAcceptAnswer
         */
        public static fromObject(object: { [k: string]: any }): types.MessageAcceptAnswer;

        /**
         * Creates a plain object from a MessageAcceptAnswer message. Also converts values to other types if specified.
         * @param message MessageAcceptAnswer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageAcceptAnswer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageAcceptAnswer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageAcceptAnswer
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageDisputeAnswer. */
    interface IMessageDisputeAnswer {

        /** MessageDisputeAnswer disputerAddress */
        disputerAddress?: (Uint8Array|null);

        /** MessageDisputeAnswer answerId */
        answerId?: (string|null);

        /** MessageDisputeAnswer reasonHash */
        reasonHash?: (string|null);
    }

    /** Represents a MessageDisputeAnswer. */
    class MessageDisputeAnswer implements IMessageDisputeAnswer {

        /**
         * Constructs a new MessageDisputeAnswer.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageDisputeAnswer);

        /** MessageDisputeAnswer disputerAddress. */
        public disputerAddress: Uint8Array;

        /** MessageDisputeAnswer answerId. */
        public answerId: string;

        /** MessageDisputeAnswer reasonHash. */
        public reasonHash: string;

        /**
         * Creates a new MessageDisputeAnswer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageDisputeAnswer instance
         */
        public static create(properties?: types.IMessageDisputeAnswer): types.MessageDisputeAnswer;

        /**
         * Encodes the specified MessageDisputeAnswer message. Does not implicitly {@link types.MessageDisputeAnswer.verify|verify} messages.
         * @param message MessageDisputeAnswer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageDisputeAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageDisputeAnswer message, length delimited. Does not implicitly {@link types.MessageDisputeAnswer.verify|verify} messages.
         * @param message MessageDisputeAnswer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageDisputeAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageDisputeAnswer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageDisputeAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageDisputeAnswer;

        /**
         * Decodes a MessageDisputeAnswer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageDisputeAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageDisputeAnswer;

        /**
         * Verifies a MessageDisputeAnswer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageDisputeAnswer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageDisputeAnswer
         */
        public static fromObject(object: { [k: string]: any }): types.MessageDisputeAnswer;

        /**
         * Creates a plain object from a MessageDisputeAnswer message. Also converts values to other types if specified.
         * @param message MessageDisputeAnswer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageDisputeAnswer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageDisputeAnswer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageDisputeAnswer
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageVerifyAnswer. */
    interface IMessageVerifyAnswer {

        /** MessageVerifyAnswer voterAddress */
        voterAddress?: (Uint8Array|null);

        /** MessageVerifyAnswer answerId */
        answerId?: (string|null);

        /** MessageVerifyAnswer vote */
        vote?: (string|null);
    }

    /** Represents a MessageVerifyAnswer. */
    class MessageVerifyAnswer implements IMessageVerifyAnswer {

        /**
         * Constructs a new MessageVerifyAnswer.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageVerifyAnswer);

        /** MessageVerifyAnswer voterAddress. */
        public voterAddress: Uint8Array;

        /** MessageVerifyAnswer answerId. */
        public answerId: string;

        /** MessageVerifyAnswer vote. */
        public vote: string;

        /**
         * Creates a new MessageVerifyAnswer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageVerifyAnswer instance
         */
        public static create(properties?: types.IMessageVerifyAnswer): types.MessageVerifyAnswer;

        /**
         * Encodes the specified MessageVerifyAnswer message. Does not implicitly {@link types.MessageVerifyAnswer.verify|verify} messages.
         * @param message MessageVerifyAnswer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageVerifyAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageVerifyAnswer message, length delimited. Does not implicitly {@link types.MessageVerifyAnswer.verify|verify} messages.
         * @param message MessageVerifyAnswer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageVerifyAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageVerifyAnswer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageVerifyAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageVerifyAnswer;

        /**
         * Decodes a MessageVerifyAnswer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageVerifyAnswer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageVerifyAnswer;

        /**
         * Verifies a MessageVerifyAnswer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageVerifyAnswer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageVerifyAnswer
         */
        public static fromObject(object: { [k: string]: any }): types.MessageVerifyAnswer;

        /**
         * Creates a plain object from a MessageVerifyAnswer message. Also converts values to other types if specified.
         * @param message MessageVerifyAnswer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageVerifyAnswer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageVerifyAnswer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageVerifyAnswer
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageStakeReputation. */
    interface IMessageStakeReputation {

        /** MessageStakeReputation address */
        address?: (Uint8Array|null);

        /** MessageStakeReputation answerId */
        answerId?: (string|null);

        /** MessageStakeReputation stakeAmount */
        stakeAmount?: (number|Long|null);
    }

    /** Represents a MessageStakeReputation. */
    class MessageStakeReputation implements IMessageStakeReputation {

        /**
         * Constructs a new MessageStakeReputation.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageStakeReputation);

        /** MessageStakeReputation address. */
        public address: Uint8Array;

        /** MessageStakeReputation answerId. */
        public answerId: string;

        /** MessageStakeReputation stakeAmount. */
        public stakeAmount: (number|Long);

        /**
         * Creates a new MessageStakeReputation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageStakeReputation instance
         */
        public static create(properties?: types.IMessageStakeReputation): types.MessageStakeReputation;

        /**
         * Encodes the specified MessageStakeReputation message. Does not implicitly {@link types.MessageStakeReputation.verify|verify} messages.
         * @param message MessageStakeReputation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageStakeReputation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageStakeReputation message, length delimited. Does not implicitly {@link types.MessageStakeReputation.verify|verify} messages.
         * @param message MessageStakeReputation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageStakeReputation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageStakeReputation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageStakeReputation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageStakeReputation;

        /**
         * Decodes a MessageStakeReputation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageStakeReputation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageStakeReputation;

        /**
         * Verifies a MessageStakeReputation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageStakeReputation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageStakeReputation
         */
        public static fromObject(object: { [k: string]: any }): types.MessageStakeReputation;

        /**
         * Creates a plain object from a MessageStakeReputation message. Also converts values to other types if specified.
         * @param message MessageStakeReputation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageStakeReputation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageStakeReputation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageStakeReputation
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageRewardReputation. */
    interface IMessageRewardReputation {

        /** MessageRewardReputation fromAddress */
        fromAddress?: (Uint8Array|null);

        /** MessageRewardReputation toAddress */
        toAddress?: (Uint8Array|null);

        /** MessageRewardReputation points */
        points?: (number|Long|null);

        /** MessageRewardReputation reason */
        reason?: (string|null);
    }

    /** Represents a MessageRewardReputation. */
    class MessageRewardReputation implements IMessageRewardReputation {

        /**
         * Constructs a new MessageRewardReputation.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageRewardReputation);

        /** MessageRewardReputation fromAddress. */
        public fromAddress: Uint8Array;

        /** MessageRewardReputation toAddress. */
        public toAddress: Uint8Array;

        /** MessageRewardReputation points. */
        public points: (number|Long);

        /** MessageRewardReputation reason. */
        public reason: string;

        /**
         * Creates a new MessageRewardReputation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageRewardReputation instance
         */
        public static create(properties?: types.IMessageRewardReputation): types.MessageRewardReputation;

        /**
         * Encodes the specified MessageRewardReputation message. Does not implicitly {@link types.MessageRewardReputation.verify|verify} messages.
         * @param message MessageRewardReputation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageRewardReputation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageRewardReputation message, length delimited. Does not implicitly {@link types.MessageRewardReputation.verify|verify} messages.
         * @param message MessageRewardReputation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageRewardReputation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageRewardReputation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageRewardReputation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageRewardReputation;

        /**
         * Decodes a MessageRewardReputation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageRewardReputation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageRewardReputation;

        /**
         * Verifies a MessageRewardReputation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageRewardReputation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageRewardReputation
         */
        public static fromObject(object: { [k: string]: any }): types.MessageRewardReputation;

        /**
         * Creates a plain object from a MessageRewardReputation message. Also converts values to other types if specified.
         * @param message MessageRewardReputation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageRewardReputation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageRewardReputation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageRewardReputation
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessagePenaltyReputation. */
    interface IMessagePenaltyReputation {

        /** MessagePenaltyReputation fromAddress */
        fromAddress?: (Uint8Array|null);

        /** MessagePenaltyReputation toAddress */
        toAddress?: (Uint8Array|null);

        /** MessagePenaltyReputation points */
        points?: (number|Long|null);

        /** MessagePenaltyReputation reason */
        reason?: (string|null);
    }

    /** Represents a MessagePenaltyReputation. */
    class MessagePenaltyReputation implements IMessagePenaltyReputation {

        /**
         * Constructs a new MessagePenaltyReputation.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessagePenaltyReputation);

        /** MessagePenaltyReputation fromAddress. */
        public fromAddress: Uint8Array;

        /** MessagePenaltyReputation toAddress. */
        public toAddress: Uint8Array;

        /** MessagePenaltyReputation points. */
        public points: (number|Long);

        /** MessagePenaltyReputation reason. */
        public reason: string;

        /**
         * Creates a new MessagePenaltyReputation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessagePenaltyReputation instance
         */
        public static create(properties?: types.IMessagePenaltyReputation): types.MessagePenaltyReputation;

        /**
         * Encodes the specified MessagePenaltyReputation message. Does not implicitly {@link types.MessagePenaltyReputation.verify|verify} messages.
         * @param message MessagePenaltyReputation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessagePenaltyReputation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessagePenaltyReputation message, length delimited. Does not implicitly {@link types.MessagePenaltyReputation.verify|verify} messages.
         * @param message MessagePenaltyReputation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessagePenaltyReputation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessagePenaltyReputation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessagePenaltyReputation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessagePenaltyReputation;

        /**
         * Decodes a MessagePenaltyReputation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessagePenaltyReputation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessagePenaltyReputation;

        /**
         * Verifies a MessagePenaltyReputation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessagePenaltyReputation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessagePenaltyReputation
         */
        public static fromObject(object: { [k: string]: any }): types.MessagePenaltyReputation;

        /**
         * Creates a plain object from a MessagePenaltyReputation message. Also converts values to other types if specified.
         * @param message MessagePenaltyReputation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessagePenaltyReputation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessagePenaltyReputation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessagePenaltyReputation
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageFollowUser. */
    interface IMessageFollowUser {

        /** MessageFollowUser followerAddress */
        followerAddress?: (Uint8Array|null);

        /** MessageFollowUser targetAddress */
        targetAddress?: (Uint8Array|null);
    }

    /** Represents a MessageFollowUser. */
    class MessageFollowUser implements IMessageFollowUser {

        /**
         * Constructs a new MessageFollowUser.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageFollowUser);

        /** MessageFollowUser followerAddress. */
        public followerAddress: Uint8Array;

        /** MessageFollowUser targetAddress. */
        public targetAddress: Uint8Array;

        /**
         * Creates a new MessageFollowUser instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageFollowUser instance
         */
        public static create(properties?: types.IMessageFollowUser): types.MessageFollowUser;

        /**
         * Encodes the specified MessageFollowUser message. Does not implicitly {@link types.MessageFollowUser.verify|verify} messages.
         * @param message MessageFollowUser message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageFollowUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageFollowUser message, length delimited. Does not implicitly {@link types.MessageFollowUser.verify|verify} messages.
         * @param message MessageFollowUser message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageFollowUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageFollowUser message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageFollowUser
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageFollowUser;

        /**
         * Decodes a MessageFollowUser message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageFollowUser
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageFollowUser;

        /**
         * Verifies a MessageFollowUser message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageFollowUser message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageFollowUser
         */
        public static fromObject(object: { [k: string]: any }): types.MessageFollowUser;

        /**
         * Creates a plain object from a MessageFollowUser message. Also converts values to other types if specified.
         * @param message MessageFollowUser
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageFollowUser, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageFollowUser to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageFollowUser
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageEndorseMember. */
    interface IMessageEndorseMember {

        /** MessageEndorseMember endorserAddress */
        endorserAddress?: (Uint8Array|null);

        /** MessageEndorseMember targetAddress */
        targetAddress?: (Uint8Array|null);

        /** MessageEndorseMember skill */
        skill?: (string|null);
    }

    /** Represents a MessageEndorseMember. */
    class MessageEndorseMember implements IMessageEndorseMember {

        /**
         * Constructs a new MessageEndorseMember.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageEndorseMember);

        /** MessageEndorseMember endorserAddress. */
        public endorserAddress: Uint8Array;

        /** MessageEndorseMember targetAddress. */
        public targetAddress: Uint8Array;

        /** MessageEndorseMember skill. */
        public skill: string;

        /**
         * Creates a new MessageEndorseMember instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageEndorseMember instance
         */
        public static create(properties?: types.IMessageEndorseMember): types.MessageEndorseMember;

        /**
         * Encodes the specified MessageEndorseMember message. Does not implicitly {@link types.MessageEndorseMember.verify|verify} messages.
         * @param message MessageEndorseMember message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageEndorseMember, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageEndorseMember message, length delimited. Does not implicitly {@link types.MessageEndorseMember.verify|verify} messages.
         * @param message MessageEndorseMember message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageEndorseMember, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageEndorseMember message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageEndorseMember
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageEndorseMember;

        /**
         * Decodes a MessageEndorseMember message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageEndorseMember
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageEndorseMember;

        /**
         * Verifies a MessageEndorseMember message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageEndorseMember message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageEndorseMember
         */
        public static fromObject(object: { [k: string]: any }): types.MessageEndorseMember;

        /**
         * Creates a plain object from a MessageEndorseMember message. Also converts values to other types if specified.
         * @param message MessageEndorseMember
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageEndorseMember, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageEndorseMember to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageEndorseMember
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageCreateTribe. */
    interface IMessageCreateTribe {

        /** MessageCreateTribe creatorAddress */
        creatorAddress?: (Uint8Array|null);

        /** MessageCreateTribe name */
        name?: (string|null);

        /** MessageCreateTribe description */
        description?: (string|null);

        /** MessageCreateTribe category */
        category?: (string|null);
    }

    /** Represents a MessageCreateTribe. */
    class MessageCreateTribe implements IMessageCreateTribe {

        /**
         * Constructs a new MessageCreateTribe.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageCreateTribe);

        /** MessageCreateTribe creatorAddress. */
        public creatorAddress: Uint8Array;

        /** MessageCreateTribe name. */
        public name: string;

        /** MessageCreateTribe description. */
        public description: string;

        /** MessageCreateTribe category. */
        public category: string;

        /**
         * Creates a new MessageCreateTribe instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageCreateTribe instance
         */
        public static create(properties?: types.IMessageCreateTribe): types.MessageCreateTribe;

        /**
         * Encodes the specified MessageCreateTribe message. Does not implicitly {@link types.MessageCreateTribe.verify|verify} messages.
         * @param message MessageCreateTribe message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageCreateTribe, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageCreateTribe message, length delimited. Does not implicitly {@link types.MessageCreateTribe.verify|verify} messages.
         * @param message MessageCreateTribe message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageCreateTribe, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageCreateTribe message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageCreateTribe
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageCreateTribe;

        /**
         * Decodes a MessageCreateTribe message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageCreateTribe
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageCreateTribe;

        /**
         * Verifies a MessageCreateTribe message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageCreateTribe message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageCreateTribe
         */
        public static fromObject(object: { [k: string]: any }): types.MessageCreateTribe;

        /**
         * Creates a plain object from a MessageCreateTribe message. Also converts values to other types if specified.
         * @param message MessageCreateTribe
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageCreateTribe, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageCreateTribe to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageCreateTribe
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MessageJoinTribe. */
    interface IMessageJoinTribe {

        /** MessageJoinTribe memberAddress */
        memberAddress?: (Uint8Array|null);

        /** MessageJoinTribe tribeId */
        tribeId?: (string|null);
    }

    /** Represents a MessageJoinTribe. */
    class MessageJoinTribe implements IMessageJoinTribe {

        /**
         * Constructs a new MessageJoinTribe.
         * @param [properties] Properties to set
         */
        constructor(properties?: types.IMessageJoinTribe);

        /** MessageJoinTribe memberAddress. */
        public memberAddress: Uint8Array;

        /** MessageJoinTribe tribeId. */
        public tribeId: string;

        /**
         * Creates a new MessageJoinTribe instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageJoinTribe instance
         */
        public static create(properties?: types.IMessageJoinTribe): types.MessageJoinTribe;

        /**
         * Encodes the specified MessageJoinTribe message. Does not implicitly {@link types.MessageJoinTribe.verify|verify} messages.
         * @param message MessageJoinTribe message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: types.IMessageJoinTribe, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MessageJoinTribe message, length delimited. Does not implicitly {@link types.MessageJoinTribe.verify|verify} messages.
         * @param message MessageJoinTribe message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: types.IMessageJoinTribe, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MessageJoinTribe message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageJoinTribe
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): types.MessageJoinTribe;

        /**
         * Decodes a MessageJoinTribe message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageJoinTribe
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): types.MessageJoinTribe;

        /**
         * Verifies a MessageJoinTribe message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MessageJoinTribe message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageJoinTribe
         */
        public static fromObject(object: { [k: string]: any }): types.MessageJoinTribe;

        /**
         * Creates a plain object from a MessageJoinTribe message. Also converts values to other types if specified.
         * @param message MessageJoinTribe
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: types.MessageJoinTribe, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MessageJoinTribe to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MessageJoinTribe
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Any
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
