'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import usePan from './usePan'
import useScale from './useScale'

const nodeData = [
  'integer',
  'float',
  'string',
  'boolean',
  'add',
  'subtract',
  'multiply',
  'divide',
  'modulo',
  'exponent',
  'blend',
  'blur',
  'perlin',
  'voronoi',
  'checker',
  'noise',
  'cellular',
  'fractal',
  'displace',
  'gradient',
  'color',
  'shapes',
  'transform',
  'filter',
]

export default function Home() {
  type Point = { x: number; y: number }
  const ORIGIN = Object.freeze({ x: 0, y: 0 })

  const ref = useRef<HTMLDivElement | null>(null)
  const [offset, startPan] = usePan()
  const scale = useScale(ref)
  const [buffer, setBuffer] = useState<Point>(ORIGIN)

  useEffect(() => {
    const height = ref.current?.clientHeight ?? 0
    const width = ref.current?.clientWidth ?? 0

    setBuffer({
      x: (width - width / scale) / 2,
      y: (height - height / scale) / 2,
    })
  }, [scale, setBuffer])

  const nodes = Array.from(
    { length: nodeData.length },
    (_, i) => nodeData[i % nodeData.length]
  )
  return (
    <main className={styles.page}>
      <section className={styles.library}>
        {nodes.map((node) => (
          <article key={node} className={styles.item}>
            {node}
          </article>
        ))}
      </section>
      <section className={styles.graph} onMouseDown={startPan} ref={ref}>
        offset: {JSON.stringify(offset)}
        <br />
        scale: <span>{scale}</span>
        <div
          style={{
            backgroundImage: `url(/grid.svg)`,
            transform: `scale(${scale})`,
            backgroundPosition: `${-offset.x / scale}px ${-offset.y / scale}px`,
            position: 'absolute',
            bottom: buffer.y,
            left: buffer.x,
            right: buffer.x,
            top: buffer.y,
          }}
        ></div>
      </section>
      <section className={styles.details}>
        <article className={styles.output} />
        <article className={styles.properties}>properties</article>
      </section>
    </main>
  )
}
