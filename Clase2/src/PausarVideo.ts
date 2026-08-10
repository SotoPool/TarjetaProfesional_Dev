import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'PausarVideo',
  schema: {
    videoEntity: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('initial-state')
      .initial()
      .listen(eid, ecs.input.UI_CLICK, () => {
        const {videoEntity} = schemaAttribute.get(eid)

        if (!videoEntity) return

        const videoControls = ecs.VideoControls.get(world, videoEntity)
        const estaPausado = videoControls.paused

        ecs.VideoControls.mutate(world, videoEntity, (cursor) => {
          cursor.paused = !estaPausado
          return false // false = sí hubo cambios (según la doc oficial)
        })
      })
  },
})