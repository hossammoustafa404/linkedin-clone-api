import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1708598349370 implements MigrationInterface {
    name = 'InitDatabase1708598349370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refreshToken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_be91607b0697b092c2bdff83b45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exprience" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "employmentType" character varying NOT NULL, "companyName" character varying NOT NULL, "location" character varying NOT NULL, "locationType" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "industry" character varying NOT NULL, "description" character varying NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "PK_1662b04a2a33477fe6c04ba4da2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "school" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "unique_school_name" UNIQUE ("name"), CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "education" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "degree" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "grade" character varying NOT NULL, "profileId" uuid NOT NULL, "schoolId" uuid NOT NULL, CONSTRAINT "PK_bf3d38701b3030a8ad634d43bd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profileSkill" ("profileId" uuid NOT NULL, "skillId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0cefd07846fd5d5c9e73a4dfaa3" PRIMARY KEY ("profileId", "skillId"))`);
        await queryRunner.query(`CREATE TABLE "skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "unique_skill_name" UNIQUE ("name"), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_64b60a539377c8b4e458bdf1702" UNIQUE ("name"), CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "autherId" uuid NOT NULL, "postId" uuid, "parentId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "postReaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "reactionId" uuid NOT NULL, "postId" uuid, "commentId" uuid, "siteUserId" uuid NOT NULL, CONSTRAINT "PK_8edc8d5a4e5f5b8f6afd109ebdf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL DEFAULT '', "ownerId" uuid NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publicImage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "path" character varying NOT NULL, "publicUrl" character varying NOT NULL, "type" character varying NOT NULL, "avatarProfileId" uuid, "coverProfileId" uuid, "commentId" uuid, "postId" uuid, CONSTRAINT "REL_f1703c43277862966dd600aaa7" UNIQUE ("avatarProfileId"), CONSTRAINT "REL_a8f606cefcd5e53dd80d02dfeb" UNIQUE ("coverProfileId"), CONSTRAINT "REL_bb64cc3939c5e09f2522d32e5f" UNIQUE ("commentId"), CONSTRAINT "PK_a06b2a10b46d8d5383ba57f319a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publicVideo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "path" character varying NOT NULL, "publicUrl" character varying NOT NULL, "type" character varying NOT NULL, "commentId" uuid, "postId" uuid, CONSTRAINT "REL_79d8be2cae4abcb9aec71ef42e" UNIQUE ("commentId"), CONSTRAINT "PK_890e18d144b2e61da392f9a3891" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "fullName" character varying NOT NULL, "gender" character varying, "dateOfBirth" TIMESTAMP, "headline" character varying, "summary" character varying, "website" character varying, "siteUserId" uuid NOT NULL, CONSTRAINT "REL_a7962421bc8d7e98071ad8a7fc" UNIQUE ("siteUserId"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_92f17563f732918615d9da901a" ON "profile" ("fullName") `);
        await queryRunner.query(`CREATE TABLE "connection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'pending', "senderId" uuid NOT NULL, "recieverId" uuid NOT NULL, CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recievedNotification" ("recieverId" uuid NOT NULL, "notificationId" uuid NOT NULL, CONSTRAINT "PK_c174e4b598c850d54c3d28ab6b1" PRIMARY KEY ("recieverId", "notificationId"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entity" character varying NOT NULL, "message" character varying NOT NULL, "senderId" uuid NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "siteUser" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_eb973e86edbebaef0b798ef446d" UNIQUE ("email"), CONSTRAINT "UQ_1d67798197f2b3a349b2f011d7e" UNIQUE ("username"), CONSTRAINT "PK_4214b8010c90a0d09dfe22a09d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refreshToken" ADD CONSTRAINT "FK_7008a2b0fb083127f60b5f4448e" FOREIGN KEY ("userId") REFERENCES "siteUser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exprience" ADD CONSTRAINT "FK_4beb0940047b4a735decda004fa" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_d6ebf3bb8e04d86d532f4fb11c3" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "education" ADD CONSTRAINT "FK_055d55437d4995b575d0f080525" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profileSkill" ADD CONSTRAINT "FK_b678e80a19413210bec8e6ef6ab" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profileSkill" ADD CONSTRAINT "FK_02aa0d90dedd9d9c6eb5c77486f" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_896a3665586cb3cd2fe212e2a46" FOREIGN KEY ("autherId") REFERENCES "siteUser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postReaction" ADD CONSTRAINT "FK_c9f305e6a004b296a62ad988717" FOREIGN KEY ("reactionId") REFERENCES "reaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postReaction" ADD CONSTRAINT "FK_4335d37480a3256529b69d94b4c" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postReaction" ADD CONSTRAINT "FK_e9cc574f65995d706ac464bd3b1" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "postReaction" ADD CONSTRAINT "FK_cf591c244e0a0c269cff4dba587" FOREIGN KEY ("siteUserId") REFERENCES "siteUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_4490d00e1925ca046a1f52ddf04" FOREIGN KEY ("ownerId") REFERENCES "siteUser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publicImage" ADD CONSTRAINT "FK_f1703c43277862966dd600aaa7e" FOREIGN KEY ("avatarProfileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publicImage" ADD CONSTRAINT "FK_a8f606cefcd5e53dd80d02dfeb2" FOREIGN KEY ("coverProfileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publicImage" ADD CONSTRAINT "FK_bb64cc3939c5e09f2522d32e5f0" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publicImage" ADD CONSTRAINT "FK_07b8e7b08cb8885e7a0021f07bc" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publicVideo" ADD CONSTRAINT "FK_79d8be2cae4abcb9aec71ef42ea" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publicVideo" ADD CONSTRAINT "FK_1cb0f962f9c16bbeaea4755227c" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a7962421bc8d7e98071ad8a7fc8" FOREIGN KEY ("siteUserId") REFERENCES "siteUser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection" ADD CONSTRAINT "FK_5e429a6e2dcdf5eec4a8e5b3df5" FOREIGN KEY ("senderId") REFERENCES "siteUser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection" ADD CONSTRAINT "FK_7297f5f007131376b9ed2edcb69" FOREIGN KEY ("recieverId") REFERENCES "siteUser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recievedNotification" ADD CONSTRAINT "FK_424f0157c48bd79063e01070c50" FOREIGN KEY ("recieverId") REFERENCES "siteUser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recievedNotification" ADD CONSTRAINT "FK_adbd4e1cc211bb704f1b1bd405c" FOREIGN KEY ("notificationId") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c0af34102c13c654955a0c5078b" FOREIGN KEY ("senderId") REFERENCES "siteUser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c0af34102c13c654955a0c5078b"`);
        await queryRunner.query(`ALTER TABLE "recievedNotification" DROP CONSTRAINT "FK_adbd4e1cc211bb704f1b1bd405c"`);
        await queryRunner.query(`ALTER TABLE "recievedNotification" DROP CONSTRAINT "FK_424f0157c48bd79063e01070c50"`);
        await queryRunner.query(`ALTER TABLE "connection" DROP CONSTRAINT "FK_7297f5f007131376b9ed2edcb69"`);
        await queryRunner.query(`ALTER TABLE "connection" DROP CONSTRAINT "FK_5e429a6e2dcdf5eec4a8e5b3df5"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a7962421bc8d7e98071ad8a7fc8"`);
        await queryRunner.query(`ALTER TABLE "publicVideo" DROP CONSTRAINT "FK_1cb0f962f9c16bbeaea4755227c"`);
        await queryRunner.query(`ALTER TABLE "publicVideo" DROP CONSTRAINT "FK_79d8be2cae4abcb9aec71ef42ea"`);
        await queryRunner.query(`ALTER TABLE "publicImage" DROP CONSTRAINT "FK_07b8e7b08cb8885e7a0021f07bc"`);
        await queryRunner.query(`ALTER TABLE "publicImage" DROP CONSTRAINT "FK_bb64cc3939c5e09f2522d32e5f0"`);
        await queryRunner.query(`ALTER TABLE "publicImage" DROP CONSTRAINT "FK_a8f606cefcd5e53dd80d02dfeb2"`);
        await queryRunner.query(`ALTER TABLE "publicImage" DROP CONSTRAINT "FK_f1703c43277862966dd600aaa7e"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_4490d00e1925ca046a1f52ddf04"`);
        await queryRunner.query(`ALTER TABLE "postReaction" DROP CONSTRAINT "FK_cf591c244e0a0c269cff4dba587"`);
        await queryRunner.query(`ALTER TABLE "postReaction" DROP CONSTRAINT "FK_e9cc574f65995d706ac464bd3b1"`);
        await queryRunner.query(`ALTER TABLE "postReaction" DROP CONSTRAINT "FK_4335d37480a3256529b69d94b4c"`);
        await queryRunner.query(`ALTER TABLE "postReaction" DROP CONSTRAINT "FK_c9f305e6a004b296a62ad988717"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_896a3665586cb3cd2fe212e2a46"`);
        await queryRunner.query(`ALTER TABLE "profileSkill" DROP CONSTRAINT "FK_02aa0d90dedd9d9c6eb5c77486f"`);
        await queryRunner.query(`ALTER TABLE "profileSkill" DROP CONSTRAINT "FK_b678e80a19413210bec8e6ef6ab"`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_055d55437d4995b575d0f080525"`);
        await queryRunner.query(`ALTER TABLE "education" DROP CONSTRAINT "FK_d6ebf3bb8e04d86d532f4fb11c3"`);
        await queryRunner.query(`ALTER TABLE "exprience" DROP CONSTRAINT "FK_4beb0940047b4a735decda004fa"`);
        await queryRunner.query(`ALTER TABLE "refreshToken" DROP CONSTRAINT "FK_7008a2b0fb083127f60b5f4448e"`);
        await queryRunner.query(`DROP TABLE "siteUser"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "recievedNotification"`);
        await queryRunner.query(`DROP TABLE "connection"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_92f17563f732918615d9da901a"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "publicVideo"`);
        await queryRunner.query(`DROP TABLE "publicImage"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "postReaction"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "reaction"`);
        await queryRunner.query(`DROP TABLE "skill"`);
        await queryRunner.query(`DROP TABLE "profileSkill"`);
        await queryRunner.query(`DROP TABLE "education"`);
        await queryRunner.query(`DROP TABLE "school"`);
        await queryRunner.query(`DROP TABLE "exprience"`);
        await queryRunner.query(`DROP TABLE "refreshToken"`);
    }

}
