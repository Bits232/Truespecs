import {defineField, defineType} from 'sanity'

export const game = defineType({
  name: 'game',
  title: 'Game',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'officialRequirements',
      title: 'Official Requirements',
      type: 'object',
      fields: [
        {name: 'os', title: 'OS', type: 'string'},
        {name: 'ram', title: 'RAM (GB)', type: 'number'},
        {name: 'gpu', title: 'GPU', type: 'string'},
        {name: 'storage', title: 'Storage (GB)', type: 'number'},
      ],
    }),
    defineField({
      name: 'officialSource',
      title: 'Official Source',
      type: 'reference',
      to: [{type: 'source'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'officialSourceUrl',
      title: 'Official Source URL',
      type: 'url',
      description: 'The exact URL where these specific official specs were found.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'protonRating',
      title: 'ProtonDB Rating',
      type: 'string',
      description: 'e.g., Platinum, Gold, Silver, Bronze, Borked',
      options: {
        list: ['Platinum', 'Gold', 'Silver', 'Bronze', 'Borked'],
      },
    }),
    defineField({
      name: 'deckVerified',
      title: 'Steam Deck Verified',
      type: 'string',
      description: 'e.g., Verified, Playable, Unsupported',
    }),
    defineField({
      name: 'protonReportCount',
      title: 'ProtonDB Report Count',
      type: 'number',
    }),
    defineField({
      name: 'knownFixes',
      title: 'Known Fixes',
      type: 'array',
      description: 'Concrete, actionable community fixes for known issues (e.g. launch options, config tweaks).',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'issue', title: 'Issue', type: 'string', validation: (rule: any) => rule.required()},
            {name: 'fix', title: 'Fix', type: 'string', validation: (rule: any) => rule.required()},
            {name: 'sourceUrl', title: 'Source URL', type: 'url', validation: (rule: any) => rule.required()},
          ],
          preview: {
            select: {title: 'issue', subtitle: 'fix'},
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'protonRating'},
  },
})
