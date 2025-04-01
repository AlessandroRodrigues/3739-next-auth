import Image from "next/image";
import styles from "./comment.module.css";
import { Author } from "../Author";

export const Comment = ({ comment }) => {
  return (
    <div className={styles.comment}>
      <Author author={comment.author} />
      <strong>@{comment.author.name}</strong>
      <p>{comment.text}</p>
    </div>
  );
};
