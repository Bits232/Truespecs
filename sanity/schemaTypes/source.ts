import {defineField, defineType} from 'sanity'

export const source = defineType({
  name: 'source',
  title: 'Source',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "Steam Store", "PCGamingWiki", "ProtonDB", "Steam Reviews". Shared and reused across games — do not put a per-game URL here.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Official (Store/Publisher)', value: 'official'},
          {title: 'Community Wiki', value: 'wiki'},
          {title: 'User Report (Forum/Review)', value: 'user'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'trustScore',
      title: 'Trust Score (1-5)',
      type: 'number',
      description: '5 = Official, 1 = Anecdotal.',
      validation: (rule) => rule.required().min(1).max(5),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'type'},
  },
})
