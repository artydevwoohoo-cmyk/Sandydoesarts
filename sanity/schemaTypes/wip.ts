export default {
  name: 'wip',
  title: 'Work in Progress',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Piece Title',
      type: 'string',
    },
    {
      name: 'stage',
      title: 'Current Stage',
      type: 'string',
      options: {
        list: [
          { title: 'Sketching', value: 'Sketching' },
          { title: 'Inking', value: 'Inking' },
          { title: 'Coloring', value: 'Coloring' },
          { title: 'Finalizing', value: 'Finalizing' },
          { title: 'Done', value: 'Done' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'startedAt',
      title: 'Date Started',
      type: 'date',
    },
    {
      name: 'image',
      title: 'WIP Image (will be blurred)',
      type: 'image',
      options: { hotspot: true },
    },
  ],
}
