export const blenderTools = {
  "get_scene_info": {
    "parameters": [
      { "name": "ctx", "type": "Context" }
    ],
    "returns": "str"
  },
  "get_object_info": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "object_name", "type": "str" }
    ],
    "returns": "str"
  },
  "get_viewport_screenshot": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "max_size", "type": "int", "default": 800 }
    ],
    "returns": "Image"
  },
  "execute_blender_code": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "code", "type": "str" }
    ],
    "returns": "str"
  },
  "get_polyhaven_categories": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "asset_type", "type": "str", "default": "hdris" }
    ],
    "returns": "str"
  },
  "search_polyhaven_assets": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "asset_type", "type": "str", "default": "all" },
      { "name": "categories", "type": "str", "default": null }
    ],
    "returns": "str"
  },
  "download_polyhaven_asset": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "asset_id", "type": "str" },
      { "name": "asset_type", "type": "str" },
      { "name": "resolution", "type": "str", "default": "1k" },
      { "name": "file_format", "type": "str", "default": null }
    ],
    "returns": "str"
  },
  "set_texture": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "object_name", "type": "str" },
      { "name": "texture_id", "type": "str" }
    ],
    "returns": "str"
  },
  "get_polyhaven_status": {
    "parameters": [
      { "name": "ctx", "type": "Context" }
    ],
    "returns": "str"
  },
  "get_hyper3d_status": {
    "parameters": [
      { "name": "ctx", "type": "Context" }
    ],
    "returns": "str"
  },
  "get_sketchfab_status": {
    "parameters": [
      { "name": "ctx", "type": "Context" }
    ],
    "returns": "str"
  },
  "search_sketchfab_models": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "query", "type": "str" },
      { "name": "categories", "type": "str", "default": null },
      { "name": "count", "type": "int", "default": 20 },
      { "name": "downloadable", "type": "bool", "default": true }
    ],
    "returns": "str"
  },
  "download_sketchfab_model": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "uid", "type": "str" }
    ],
    "returns": "str"
  },
  "generate_hyper3d_model_via_text": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "text_prompt", "type": "str" },
      { "name": "bbox_condition", "type": "list<float>", "default": null }
    ],
    "returns": "str"
  },
  "generate_hyper3d_model_via_images": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "input_image_paths", "type": "list<str>", "default": null },
      { "name": "input_image_urls", "type": "list<str>", "default": null },
      { "name": "bbox_condition", "type": "list<float>", "default": null }
    ],
    "returns": "str"
  },
  "poll_rodin_job_status": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "subscription_key", "type": "str", "default": null },
      { "name": "request_id", "type": "str", "default": null }
    ]
  },
  "import_generated_asset": {
    "parameters": [
      { "name": "ctx", "type": "Context" },
      { "name": "name", "type": "str" },
      { "name": "task_uuid", "type": "str", "default": null },
      { "name": "request_id", "type": "str", "default": null }
    ]
  }
}


export const jsonformat = {
    type: "Method_Name",
    params: {
        code: ""
    }
}