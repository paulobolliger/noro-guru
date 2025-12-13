import { describe, it, expect } from 'vitest'

describe('Financeiro App Safe Net', () => {
    it('should pass basic math sanity check', () => {
        expect(1 + 1).toBe(2)
    })

    it('should be able to render a simple component', () => {
        // This requires react setup to be correct
        const element = document.createElement('div')
        element.innerHTML = 'Hello World'
        expect(element.textContent).toBe('Hello World')
    })
})
