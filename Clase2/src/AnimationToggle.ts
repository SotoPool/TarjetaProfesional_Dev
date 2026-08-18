import * as ecs from '@8thwall/ecs'

type HandlerEntry = {
  handleClick: () => void
  button: bigint
}

const handlers = new Map<bigint, HandlerEntry>()

ecs.registerComponent({
  name: 'AnimationToggle',

  schema: {
    model: ecs.eid,
    button: ecs.eid,
    animationA: ecs.string,
    animationB: ecs.string,
    crossFadeDuration: ecs.f32,
  },

  schemaDefaults: {
    animationA: 'Idle',
    animationB: 'Walk',
    crossFadeDuration: 0.2,
  },

  data: {
    isPlayingA: ecs.boolean,
  },

  add: (world, component) => {
    const {eid, schema, data} = component

    data.isPlayingA = true

    const handleClick = () => {
      const nextClip = data.isPlayingA ? schema.animationB : schema.animationA

      ecs.GltfModel.mutate(world, schema.model, (cursor) => {
        cursor.animationClip = nextClip
        cursor.loop = true
        cursor.paused = false
        cursor.crossFadeDuration = schema.crossFadeDuration
        return false
      })

      data.isPlayingA = !data.isPlayingA
    }

    // Guardamos referencia usando el eid (bigint) como clave
    handlers.set(eid, {handleClick, button: schema.button})
    world.events.addListener(schema.button, ecs.input.UI_CLICK, handleClick)
  },

  remove: (world, component) => {
    const entry = handlers.get(component.eid)
    if (entry) {
      world.events.removeListener(entry.button, ecs.input.UI_CLICK, entry.handleClick)
      handlers.delete(component.eid)
    }
  },
})