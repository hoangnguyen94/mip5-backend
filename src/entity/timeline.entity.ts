import { IsPositive } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseClass } from "./base.entity";
import { Project } from "./project.entity";
import { User } from "./user.entity";

@Entity()
export class Timeline extends BaseClass {
  @ManyToOne(() => User)
  creator!: User;

  @ManyToOne(() => Project, (project) => project.timelines)
  project: Project;

  @Field(() => String)
  @Column({ nullable: false })
  content!: string;

  constructor(creator: User, content: string) {
    super();
    this.creator = creator;
    this.content = content;
  }
}
