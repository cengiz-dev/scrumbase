# Scrumbase
ScrumBase is a Scrum tool written with Angular.

## Demo
Follow [this link](https://stackblitz.com/github/cengiz-dev/scrumbase) in order to view the demo running on StackBlitz.

## Firebase
If you plan on using Firebase, then you'll need to create an `environment.firebase.ts` file in the `src/app/environments` directory that contains Firebase configuration information as follows:

```typescript
export const firebaseEnvironment = {
    apiKey: '****',
    authDomain: '****.firebaseapp.com',
    databaseURL: 'https://****.firebaseio.com',
    projectId: '****',
    storageBucket: '****.appspot.com',
    messagingSenderId: '************'
};
```

# Help on Angular

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
