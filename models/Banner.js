import mongoose from "mongoose";

const bannerShema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    status: {
        type: Boolean,
        default: true
    }
})

const Banner = mongoose.model("Banner", bannerShema)
export default  Banner;