import { useState } from 'react'
import Graph from '../../graph/component'
import styles from './styles.module.css'

export function NewGraph() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

  return (
    <article
      className={styles.graph}
      onWheel={(event) => {
        setScrollPosition({
          x: scrollPosition.x + event.deltaX,
          y: scrollPosition.y + event.deltaY,
        })
      }}
    >
      {/* {scrollPosition.x}, {scrollPosition.y} */}
      <div
        className={styles.grid}
        style={{
          backgroundImage: `url(/grid.svg)`,
          backgroundPosition: `${scrollPosition.x}px ${scrollPosition.y}px`,
        }}
      >
        <Graph />
        {/* <NewLibrary /> */}
      </div>
    </article>
  )
}
