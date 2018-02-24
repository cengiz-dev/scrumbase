import { Observable } from "rxjs/Observable";
import { IScheduler } from "rxjs/Scheduler";
import { fromPromise } from "rxjs/observable/fromPromise";
import { ThenableReference } from '@firebase/database-types';

function staticFromThenable<T>(thenable: ThenableReference, scheduler?: IScheduler): Observable<T> {
  const anything: any = thenable;
  return fromPromise(anything as Promise<T>, scheduler);
}

Observable.fromThenable = staticFromThenable;

declare module "rxjs/Observable" {
  namespace Observable {
    export let fromThenable: typeof staticFromThenable;
  }
}