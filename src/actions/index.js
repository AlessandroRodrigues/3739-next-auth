"use server";

import { revalidatePath } from "next/cache";
import db from "../../prisma/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import bcrypit from "bcrypt";

export async function incrementThumbsUp(post) {
  // await new Promise((resolve) => setTimeout( resolve, 3500))

  await db.post.update({
    where: {
      id: post.id,
    },
    data: {
      likes: {
        increment: 1,
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/${post.slug}`);
}

export async function postComment(post, formData) {
  // const author = await db.user.findFirst({
  //     where: {
  //         username: 'anabeatriz_dev'
  //     }
  // })

  const session = await getServerSession(options);

  console.log("session", session);

  await db.comment.create({
    data: {
      text: formData.get("text"),
      authorId: session.user.id, //user esta sem id
      postId: post.id,
    },
  });

  revalidatePath("/");
  revalidatePath(`/${post.slug}`);
}

export async function postReply(parent, formData) {
  // const author = await db.user.findFirst({
  //     where: {
  //         username: 'anabeatriz_dev'
  //     }
  // })

  const session = await getServerSession(options);

  const post = await db.post.findFirst({
    where: {
      id: parent.postId,
    },
  });

  console.log("session2", session);

  await db.comment.create({
    data: {
      text: formData.get("text"),
      authorId: session.user.id,
      postId: post.id,
      parentId: parent.parentId ?? parent.id,
    },
  });
  revalidatePath(`/${post.slug}`);
}

export async function createUser(formData) {
  try {
    console.log("iniciando cadastro de usuário...");

    const hashedPassword = bcrypit.hashSync(formData.get("password"), 10);

    await db.user.create({
      data: {
        name: formData.get("name"),
        email: formData.get("email"),
        password: hashedPassword,
      },
    });

    console.log("usuário criado com sucesso!");
  } catch (error) {
    console.log("Falha ao criar usuário =>", error);
    return;
  }

  redirect("/signin");
}
