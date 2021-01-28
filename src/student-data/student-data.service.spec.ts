import { Test, TestingModule } from '@nestjs/testing';
import { StudentDataService } from './student-data.service';
import { AuthService } from 'src/auth/auth.service';
import { STUDENT_DATA_OPTIONS } from './student-data.constants';

describe('StudentDataService', () => {
  let service: StudentDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentDataService,
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: STUDENT_DATA_OPTIONS,
          useValue: { studentApis: ['someurl'] },
        },
      ],
    }).compile();

    service = module.get<StudentDataService>(StudentDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
