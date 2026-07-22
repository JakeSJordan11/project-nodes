@group(0) @binding(0) var tex : texture_storage_2d<${presentationFormat}, write>;

    @compute @workgroup_size(1)
    fn cs(@builtin(global_invocation_id) id : vec3u)
    {
        let size = textureDimensions(tex);
        if (id.x >= size.x || id.y >= size.y)
        {
            return;
        }

        //cheap hash
        let seed = id.x * 1973u + id.y * 9277u + 89173u;
        let n = f32((seed << 13u) ^ seed) * 0.0000001;
        let v = fract(sin(n) * 43758.5453);

        textureStore(tex, id.xy, vec4f(v, v, v, 1.0));
    }
