
let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
*/
export const GameStates = Object.freeze({ Ok:0,"0":"Ok",Eaten:1,"1":"Eaten",Over:2,"2":"Over",Win:3,"3":"Win", });
/**
*/
export const Block = Object.freeze({ Empty:0,"0":"Empty",Snake:1,"1":"Snake",Food:2,"2":"Food", });
/**
*/
export const Direction = Object.freeze({ Left:0,"0":"Left",Right:1,"1":"Right",Up:2,"2":"Up",Down:3,"3":"Down", });
/**
*/
export class Food {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_food_free(ptr);
    }
}
/**
*/
export class Game {

    static __wrap(ptr) {
        const obj = Object.create(Game.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_game_free(ptr);
    }
    /**
    * @param {number} width
    * @param {number} height
    * @returns {Game}
    */
    static init(width, height) {
        const ret = wasm.game_init(width, height);
        return Game.__wrap(ret);
    }
    /**
    * @param {number} row
    * @param {number} col
    * @returns {number}
    */
    get_index(row, col) {
        const ret = wasm.game_get_index(this.ptr, row, col);
        return ret;
    }
    /**
    * @returns {number}
    */
    tick() {
        const ret = wasm.game_tick(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get_blocks() {
        const ret = wasm.game_get_blocks(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    width() {
        const ret = wasm.game_width(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    height() {
        const ret = wasm.game_height(this.ptr);
        return ret;
    }
    /**
    * @param {number} new_direction
    */
    change_snake_direction(new_direction) {
        wasm.game_change_snake_direction(this.ptr, new_direction);
    }
}
/**
*/
export class Pos {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pos_free(ptr);
    }
}
/**
*/
export class Snake {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_snake_free(ptr);
    }
    /**
    * @param {number} new_direction
    */
    change_direction(new_direction) {
        wasm.snake_change_direction(this.ptr, new_direction);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_random_3654443b1cfe03d5 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedUint8Memory0 = new Uint8Array();


    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('wasm_snake_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
