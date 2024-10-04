import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, //Clodinery URL
      required: true,
    },
    thumbnail: {
      type: String, //Clodinery URL
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      require: true,
    },
    duration: {
      type: String, //Cloudinery URL
      require: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    oener: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

mongoose.plugin(mongooseAggregatePaginate); //Powerful জিনিস। অনেককিছু করা যায় এইটা দিয়ে

export const Video = mongoose.model("Video", videoSchema);
