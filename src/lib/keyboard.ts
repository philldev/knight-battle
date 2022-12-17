export class Keyboard {
	static KEY_STATE = {
		PRESSED: 'PRESSED',
		PRESSED_TWICE: 'PRESSED_TWICE',
		RELEASED: 'RELEASED',
		DOWN: 'DOWN',
		UP: 'UP',
	} as const

	static KEYS = {
		a: 'a',
		s: 's',
		d: 'd',
		w: 'w',
		' ': ' ',
	} as const

	private _keys: Record<string, keyof typeof Keyboard.KEY_STATE> = {}

	public lastKey?: string = undefined

	constructor() {
		for (const key in Keyboard.KEYS) {
			this._keys[key] = Keyboard.KEY_STATE.UP
		}
	}

	private _keyExist(key: string) {
		return this._keys[key] !== undefined
	}

	private _delta = 500
	private _lastKeyPressTime = 0

	public onPressed(key: string) {
		if (this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.UP) {
			let keyPressTime = new Date().getTime()
			if (keyPressTime - this._lastKeyPressTime <= this._delta) {
				console.log('pressed twice')

				this._keys[key] = Keyboard.KEY_STATE.PRESSED_TWICE
				keyPressTime = 0
			} else {
				this._keys[key] = Keyboard.KEY_STATE.PRESSED
			}
			this.lastKey = key
			this._lastKeyPressTime = keyPressTime
		}
	}
	public onReleased(key: string) {
		if (this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.DOWN) {
			this._keys[key] = Keyboard.KEY_STATE.RELEASED
		}
	}
	public isDown(key: string[]): boolean
	public isDown(key: string): boolean
	public isDown(key: string | string[]): boolean {
		if (Array.isArray(key)) {
			let res = false
			for (const k of key) {
				if (this._keyExist(k) && this._keys[k] === Keyboard.KEY_STATE.DOWN) {
					res = true
					break
				}
			}
			return res
		} else {
			return this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.DOWN
		}
	}

	public isUp(key: string[]): boolean
	public isUp(key: string): boolean
	public isUp(key: string | string[]): boolean {
		if (Array.isArray(key)) {
			let res = false
			for (const k of key) {
				if (this._keyExist(k) && this._keys[k] === Keyboard.KEY_STATE.UP) {
					res = true
					break
				}
			}
			return res
		}
		return this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.UP
	}
	public wasPressed(key: string[], pressedTwice?: boolean): boolean
	public wasPressed(key: string, pressedTwice?: boolean): boolean
	public wasPressed(key: string | string[], pressedTwice?: boolean) {
		if (pressedTwice) {
			if (Array.isArray(key)) {
				let res = false
				for (const k of key) {
					if (
						this._keyExist(k) &&
						this._keys[k] === Keyboard.KEY_STATE.PRESSED_TWICE
					) {
						res = true
						break
					}
				}
				return res
			}
			return (
				this._keyExist(key) &&
				this._keys[key] === Keyboard.KEY_STATE.PRESSED_TWICE
			)
		}

		if (Array.isArray(key)) {
			let res = false
			for (const k of key) {
				if (this._keyExist(k) && this._keys[k] === Keyboard.KEY_STATE.PRESSED) {
					res = true
					break
				}
			}
			return res
		}
		return this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.PRESSED
	}
	public wasReleased(key: string[]): boolean
	public wasReleased(key: string): boolean
	public wasReleased(key: string | string[]) {
		if (Array.isArray(key)) {
			let res = false
			for (const k of key) {
				if (
					this._keyExist(k) &&
					this._keys[k] === Keyboard.KEY_STATE.RELEASED
				) {
					res = true
					break
				}
			}
			return res
		}
		return (
			this._keyExist(key) && this._keys[key] === Keyboard.KEY_STATE.RELEASED
		)
	}

	public update() {
		Object.keys(this._keys).forEach((key) => {
			switch (this._keys[key]) {
				case Keyboard.KEY_STATE.PRESSED:
					this._keys[key] = Keyboard.KEY_STATE.DOWN
					break
				case Keyboard.KEY_STATE.PRESSED_TWICE:
					this._keys[key] = Keyboard.KEY_STATE.DOWN
					break
				case Keyboard.KEY_STATE.RELEASED:
					this._keys[key] = Keyboard.KEY_STATE.UP
					break
				default:
					break
			}
		})
	}
}
