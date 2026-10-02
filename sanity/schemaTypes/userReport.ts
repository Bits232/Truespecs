import {defineField, defineType} from 'sanity'

export const userReport = defineType({
  name: 'userReport',
  title: 'User Report',
  type: 'document',
  fields: [
    defineField({
      name: 'game',
      title: 'Game',
      type: 'reference',
      to: [{type: 'game'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'reference',
      to: [{type: 'source'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'The exact URL of this specific report.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          {title: 'Windows', value: 'windows'},
          {title: 'Linux / Proton', value: 'linux'},
          {title: 'Steam Deck', value: 'steam_deck'},
          {title: 'Unspecified', value: 'unspecified'},
        ],
      },
      initialValue: 'unspecified',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'userSpecs',
      title: 'User Specs',
      type: 'object',
      fields: [
        {name: 'os', title: 'OS', type: 'string'},
        {name: 'ram', title: 'RAM (GB)', type: 'number'},
        {name: 'gpu', title: 'GPU', type: 'string'},
        {name: 'cpu', title: 'CPU', type: 'string'},
      ],
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'string',
      options: {
        list: [
          {title: 'Runs Well', value: 'runs_well'},
          {title: 'Runs with Issues (Stutter/Performance)', value: 'runs_with_issues'},
          {title: 'Does Not Launch', value: 'does_not_launch'},
          {title: 'Crashes During Play', value: 'crashes_during_play'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'The actual claim, close to verbatim from the source.',
    }),
    defineField({
      name: 'date',
      title: 'Date Observed',
      type: 'datetime',
      description: 'Freshness matters — an old report of an issue may already be fixed.',
    }),
  ],
  preview: {
    select: {title: 'game.title', subtitle: 'result'},
  },
})
