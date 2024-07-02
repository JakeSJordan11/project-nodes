'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface WebGPUContextType {
  device: GPUDevice | null
  presentationFormat: GPUTextureFormat | null
}

const WebGPUContext = createContext<WebGPUContextType>({
  device: null,
  presentationFormat: null,
})

export const WebGPUProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [device, setDevice] = useState<GPUDevice | null>(null)
  const [presentationFormat, setPresentationFormat] =
    useState<GPUTextureFormat | null>(null)

  useEffect(() => {
    async function initWebGPU() {
      const adapter = await navigator.gpu?.requestAdapter()
      const device = await adapter?.requestDevice()
      if (!device) {
        console.error('No WebGPU device found.')
        return
      }

      const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

      setDevice(device)
      setPresentationFormat(presentationFormat)
    }

    initWebGPU()
  }, [])

  return (
    <WebGPUContext.Provider value={{ device, presentationFormat }}>
      {children}
    </WebGPUContext.Provider>
  )
}

export const useWebGPU = () => useContext(WebGPUContext)
