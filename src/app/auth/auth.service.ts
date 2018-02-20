import { Observable } from 'rxjs/Observable';

import { User } from '../model/user.model';

export abstract class AuthService {
    abstract login();

    abstract logout();

    abstract getUser(): Observable<User | null>;
}
