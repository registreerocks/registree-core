/**
 * Helpers for loading MongoDB fixtures.
 */

import type { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Customer } from '../../src/customers/models/customer.model';
import { Degree } from '../../src/universities/models/degree.model';
import { Faculty } from '../../src/universities/models/faculty.model';
import { University } from '../../src/universities/models/university.model';
import { getCustomers } from './customers.fixture';
import { getDegrees } from './degrees.fixture';
import { getFaculties } from './faculties.fixture';
import { getUniversities } from './universities.fixture';

/** The available fixture names. */
export type FixtureName = 'degrees' | 'customers';

/**
 * A fixture of one or more datasets that can be installed and removed.
 */
export class Fixture {
  constructor(readonly names: FixtureName[]) {}

  async install(app: INestApplication): Promise<void> {
    const models = getModels(app);
    for (const name of this.names) {
      await fixtures[name].expunge(models);
      await fixtures[name].load(models);
    }
  }

  async remove(app: INestApplication): Promise<void> {
    const models = getModels(app);
    for (const name of this.names) {
      await fixtures[name].expunge(models);
    }
  }
}

type FixtureLoader = {
  expunge: (models: FixtureModels) => Promise<void>;
  load: (models: FixtureModels) => Promise<void>;
};

/** Helper: Define expunge and load commands for each {@link FixtureName}. */
const fixtures: { [name in FixtureName]: FixtureLoader } = {
  degrees: {
    async expunge(models: FixtureModels): Promise<void> {
      await models.University.deleteMany();
      await models.Faculty.deleteMany();
      await models.Degree.deleteMany();
    },
    async load(models: FixtureModels): Promise<void> {
      await models.University.insertMany(getUniversities());
      await models.Faculty.insertMany(getFaculties());
      await models.Degree.insertMany(getDegrees());
    },
  },

  customers: {
    async expunge(models: FixtureModels): Promise<void> {
      await models.Customer.deleteMany();
    },
    async load(models: FixtureModels): Promise<void> {
      await models.Customer.insertMany(getCustomers());
    },
  },
};

type FixtureModels = {
  University: Model<University>;
  Faculty: Model<Faculty>;
  Degree: Model<Degree>;
  Customer: Model<Customer>;
};

/** Helper: Get the {@link Model} instances used by the fixtures. */
function getModels(app: INestApplication): FixtureModels {
  return {
    University: app.get(getModelToken(University.name)),
    Faculty: app.get(getModelToken(Faculty.name)),
    Degree: app.get(getModelToken(Degree.name)),
    Customer: app.get(getModelToken(Customer.name)),
  };
}
