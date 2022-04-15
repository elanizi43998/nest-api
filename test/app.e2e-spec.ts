import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookMarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('APP e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    app.init();
    app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'abde@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('Should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
        // .inspect()
      });
      it('Should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
        // .inspect()
      });
      it('Should throw if body is empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
        // .inspect()
      });
      it('Should Signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
        // .inspect()
      });
    });
    describe('Signin', () => {
      it('Should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
        // .inspect()
      });
      it('Should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
        // .inspect()
      });
      it('Should throw if body is empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
        // .inspect()
      });
      it('Should Signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAT', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('Should pass get me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .expectStatus(200);
      });
    });
    describe('Edit User', () => {
      it('Shoul Edit user', () => {
        const dto: EditUserDto = {
          firstname: 'Abderrahmane',
          email: 'abderrahmane@editemail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstname);
      });
    });
  });
  describe('Bookmark', () => {
    describe('Get empty Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Bookmark', () => {
      it('should create bookmarks', () => {
        const dto: CreateBookMarkDto = {
          title: 'You will make it',
          link: 'https://www.google.com/maps/place/Souissi,+Rabat/@33.9794231,-6.8594171,14z/data=!3m1!4b1!4m5!3m4!1s0xda76ca473113823:0x32368e7e4738cfab!8m2!3d33.9799302!4d-6.84046',
        };
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .withBody(dto)
          .stores('bookmarkId', 'id')
          .expectStatus(201);
      });
    });
    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Bookmark by Id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });
    describe('Edit Bookmark', () => {
      const dto: EditBookmarkDto = {
        title: 'Luck is what happens when preparation meets opportunity.',
        description:
          '“We suffer more often in imagination that in reality.” — Seneca',
      };
      it('should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });
    describe('Delete Bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAT}`,
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
