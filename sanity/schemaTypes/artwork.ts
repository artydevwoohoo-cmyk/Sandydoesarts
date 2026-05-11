export default {
  name: 'artwork',
  title: 'Gallery Art',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title of Piece',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Original Art', value: 'original' },
          { title: 'Commissions', value: 'commission' },
          { title: 'Crochet Lab', value: 'crochet' },
        ],
      },
    },
    {
      name: 'image',
      title: 'Upload Image',
      type: 'image',
      options: {
        hotspot: true, // Allows her to crop the image inside the dashboard
      },
    },
    {
      name: 'isFeatured',
      title: 'Feature on Homepage?',
      type: 'boolean',
      initialValue: false,
    },
  ],
}