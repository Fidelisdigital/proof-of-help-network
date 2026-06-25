import { bls12_381 } from '@noble/curves/bls12-381.js';

export function hexToBytes(hex: string): Uint8Array {
    return new Uint8Array(Buffer.from(hex, 'hex'));
}

export function bytesToHex(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('hex');
}

export function hexToBase64(hex: string): string {
    return Buffer.from(hex, 'hex').toString('base64');
}

export function signBLS(privateKeyHex: string, message: Uint8Array): Uint8Array {
    const privateKeyBytes = hexToBytes(privateKeyHex);
    const hashedPoint = bls12_381.longSignatures.hash(message);
    const signaturePoint = bls12_381.longSignatures.sign(hashedPoint, privateKeyBytes);
    return bls12_381.longSignatures.Signature.toBytes(signaturePoint);
}

export function buildTxJson(
    msgType: string,
    msgTypeUrl: string,
    msgBytes: Uint8Array,
    publicKeyHex: string,
    privateKeyHex: string,
    height: number,
    networkId = 1,
    chainId = 1,
    fee = 1000
): any {
    const txTime = Date.now() * 1000;

    // Build sign bytes manually matching Canopy Transaction proto
    const signData = buildSignBytes(
        msgType, msgTypeUrl, msgBytes,
        txTime, height, fee, networkId, chainId
    );

    const signature = signBLS(privateKeyHex, signData);

    return {
        type: msgType,
        msgTypeUrl: msgTypeUrl,
        msgBytes: bytesToHex(msgBytes),
        signature: {
            publicKey: publicKeyHex,
            signature: bytesToHex(signature)
        },
        time: txTime,
        createdHeight: height,
        fee: fee,
        memo: '',
        networkID: networkId,
        chainID: chainId
    };
}

function buildSignBytes(
    msgType: string,
    msgTypeUrl: string,
    msgBytes: Uint8Array,
    time: number,
    createdHeight: number,
    fee: number,
    networkId: number,
    chainId: number
): Uint8Array {
    // Manual protobuf encoding of Transaction for signing
    // Field 1: message_type (string)
    // Field 2: msg (Any with type_url and value)
    // Field 4: created_height (uint64)
    // Field 5: time (uint64)
    // Field 6: fee (uint64)
    // Field 8: network_id (uint64)
    // Field 9: chain_id (uint64)
    const parts: Uint8Array[] = [];

    // Field 1: message_type string
    const msgTypeBytes = new TextEncoder().encode(msgType);
    parts.push(encodeField(1, 2, msgTypeBytes));

    // Field 2: Any message
    const typeUrlBytes = new TextEncoder().encode(msgTypeUrl);
    const anyBytes = concatBytes(
        encodeField(1, 2, typeUrlBytes),
        encodeField(2, 2, msgBytes)
    );
    parts.push(encodeField(2, 2, anyBytes));

    // Field 4: created_height
    parts.push(encodeVarintField(4, createdHeight));

    // Field 5: time
    parts.push(encodeVarintField(5, time));

    // Field 6: fee
    parts.push(encodeVarintField(6, fee));

    // Field 8: network_id
    parts.push(encodeVarintField(8, networkId));

    // Field 9: chain_id
    parts.push(encodeVarintField(9, chainId));

    return concatBytes(...parts);
}

function encodeVarint(value: number): Uint8Array {
    const bytes: number[] = [];
    let v = value;
    while (v > 127) {
        bytes.push((v & 0x7f) | 0x80);
        v = Math.floor(v / 128);
    }
    bytes.push(v & 0x7f);
    return new Uint8Array(bytes);
}

function encodeField(fieldNumber: number, wireType: number, data: Uint8Array): Uint8Array {
    const tag = (fieldNumber << 3) | wireType;
    const tagBytes = encodeVarint(tag);
    const lenBytes = encodeVarint(data.length);
    return concatBytes(tagBytes, lenBytes, data);
}

function encodeVarintField(fieldNumber: number, value: number): Uint8Array {
    if (value === 0) return new Uint8Array(0);
    const tag = (fieldNumber << 3) | 0;
    const tagBytes = encodeVarint(tag);
    const valBytes = encodeVarint(value);
    return concatBytes(tagBytes, valBytes);
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
    const total = arrays.reduce((sum, a) => sum + a.length, 0);
    const result = new Uint8Array(total);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
