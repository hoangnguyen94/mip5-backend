import { IsPositive } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseClass } from "./base.entity";
import { Comment } from "./comment.entity";
import { Product } from "./product.entity";
import { Project } from "./project.entity";
import { User } from "./user.entity";

@Entity()
export class Like extends BaseClass {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    eager: true,
  })
  creator!: User;

  @ManyToOne(() => Project, (proj) => proj.likes)
  project: Project;

  @ManyToOne(() => Comment, (proj) => proj.likes)
  comment: Comment;
}
