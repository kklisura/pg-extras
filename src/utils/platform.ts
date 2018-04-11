import {sync as usernameSync} from 'username'

/**
 * Returns the username for current system.
 */
export function getUsername(): string {
    return usernameSync()
}
