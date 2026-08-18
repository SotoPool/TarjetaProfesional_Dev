import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Abrir Link',
  schema: {
    url: ecs.string, 
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    ecs.defineState('initial-state')
      .initial()
      .listen(eid, ecs.input.UI_CLICK, () => {
        const {url} = schemaAttribute.get(eid)

        if (!url) return

        window.open(url, '_blank')
      })
  },
})