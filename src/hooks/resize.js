import { useEffect } from 'haunted'

export default (setDimensions) => {
    useEffect(() => {
        const listener = window.addEventListener(
            'resize',
            ({ target: { innerHeight: height, innerWidth: width } }) => {
                setDimensions({ width, height })
            }
        )

        return () => window.removeEventListener(listener)
    }, [])
}
