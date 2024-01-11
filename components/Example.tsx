import React from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { RepositoryOption } from './RepositoryOption'
import { FaceSmileIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

type Repository = {
  id: string
  name: string
  full_name: string
  open_issues_count: number
  stargazers_count: number
  forks_count: number
  url: string
  language: string
  clone_url: string
  owner: {
    login: string
    avatar_url: string
  }
}

type APIResponse = { items: Repository[] }

export default function Example() {
  const [open, setOpen] = React.useState(true)

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setOpen(true)
      }, 500)
    }
  }, [open])

  const [rawQuery, setRawQuery] = React.useState('')
  const query = rawQuery.toLowerCase().replace(/^[#>]/, '')

  const [repos, setRepos] = React.useState<Repository[]>([])
  const getQueryResult = async () => {
    try {
      const res = await fetch(`/api/search?q=${query}`)
      const result: APIResponse = await res.json()
      setRepos(result.items)
      console.log('res', result)
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    getQueryResult()
  }, [query])

  return (
    <Transition.Root
      show={open}
      as={React.Fragment}
      afterLeave={() => setRawQuery('')}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 p-4 overflow-y-auto sm:p-6 md:p-20">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="max-w-xl mx-auto overflow-hidden transition-all transform divide-y divide-gray-500 shadow-2xl divide-opacity-20 rounded-2xl bg-slate-900/70 shadow-slate-300/10 ring-1 ring-sky-500 ring-opacity-5 backdrop-blur-xl backdrop-filter">
              <Combobox
                value=""
                onChange={(item) => {
                  console.info('You have selected', item)
                  window.open(item)
                }}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="w-full h-12 pr-4 text-gray-100 placeholder-gray-500 bg-transparent border-0 pl-11 focus:outline-0 focus:ring-0 sm:text-sm"
                    placeholder="Search GitHub repos..."
                    onChange={(event) => setRawQuery(event.target.value)}
                  />
                </div>

                <Combobox.Options
                  static
                  className="p-4 pb-2 space-y-4 overflow-y-auto max-h-80 scroll-py-10 scroll-pb-2"
                >
                  <li>
                    <h2 className="text-xs font-semibold text-gray-200">
                      Repositories
                    </h2>
                    <ul className="-mx-4 mt-2 space-y-0.5 text-sm text-gray-700">
                      {/* <RepositoryOption />
                      <RepositoryOption />
                      <RepositoryOption /> */}
                      {repos?.map((repo) => {
                        return <RepositoryOption repo={repo} />
                      })}
                    </ul>
                  </li>
                </Combobox.Options>
                <span className="flex flex-wrap items-center bg-slate-900/20 px-4 py-2.5 text-xs text-gray-400">
                  <FaceSmileIcon className="w-4 h-4 mr-1" />
                  Welcome to Zolplay&apos;s React Interview Challenge.
                </span>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
