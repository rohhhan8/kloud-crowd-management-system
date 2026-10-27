import { NavLink, useLocation, type NavLinkProps } from 'react-router'
import { carriedSearch } from './carriedSearch'

/** NavLink that carries the site/range filters (and nothing else) to the target. */
export function PreservedSearchNavLink({ to, ...props }: NavLinkProps & { to: string }) {
  const { search } = useLocation()

  return (
    <NavLink to={{ pathname: to, search: carriedSearch(search) }} end={to === '/'} {...props} />
  )
}
