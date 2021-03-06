import { ApolloError, AuthenticationError } from "apollo-server";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AuthContext } from "../common/type";
import { Comment } from "../entity/comment.entity";
import { Like } from "../entity/like.entity";
import { Project } from "../entity/project.entity";
import { User } from "../entity/user.entity";
import { CommentDTO, CreateCommentDTO } from "../schema/comment.schema";
import {
  LikeProjectInputDTO,
  LikeDTO,
  LikeCommentInputDTO,
} from "../schema/like.schema";
import { ProjectDTO } from "../schema/project.schema";

@Resolver(Like)
export class LikeResolver {
  @Authorized()
  @Mutation(() => ProjectDTO)
  async likeProject(
    @Arg("data") data: LikeProjectInputDTO,
    @Ctx() context: AuthContext
  ) {
    try {
      const { currentUser } = context;
      const creator = await User.findOne(currentUser.id);
      const project = await Project.findOne(data.projectId);
      const like = project.likes.filter(
        (like) => like.creator.id === currentUser.id,
        []
      )[0];
      if (like) {
        await like.remove();
        await like.save();
      } else {
        const newLike = Like.create();
        newLike.creator = creator;
        newLike.project = project;
        await newLike.save();
      }
      const updatedProject = await Project.findOne(data.projectId);
      return updatedProject;
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => CommentDTO)
  async likeComment(
    @Arg("data") data: LikeCommentInputDTO,
    @Ctx() context: AuthContext
  ) {
    try {
      const { currentUser } = context;
      const creator = await User.findOne(currentUser.id);
      if (creator.id !== context.currentUser.id) {
        throw new AuthenticationError("Invalid user");
      }
      const comment = await Comment.findOne(data.commentId);
      const like = comment.likes.filter(
        (like) => like.creator.id === currentUser.id,
        []
      )[0];
      if (like) {
        await like.remove();
        await like.save();
      } else {
        const newLike = Like.create();
        newLike.creator = creator;
        newLike.comment = comment;
        await newLike.save();
      }
      const updatedComment = await Comment.findOne(data.commentId);
      return updatedComment;
    } catch (error) {
      throw error;
    }
  }
}
