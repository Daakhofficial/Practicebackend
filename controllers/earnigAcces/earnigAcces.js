const earning = require("../../Paymentmodule/RevenueSharing")
const post = require("../../models/Quill.module")



async function sendmoney(req, res) {
    try {
        const { email } = req.body;
        const platformShare = 0.7; // 70% to creators

        // ✅ Auto get current month (YYYY-MM)
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        // console.log("Current Month:", month);

        // 1. Get monthly revenue
        const monthlyRevenue = await earning.findOne({ revenue_month: month }).select("money");
        if (!monthlyRevenue) {
            return res.send({ message: "Revenue not found for this month" });
        }
        const totalRevenue = monthlyRevenue.money; // e.g. $200

        // 2. Get all posts for this month
        const allPosts = await post.find({
            createdAt: {
                $gte: new Date(`${month}-01`),
                $lte: new Date(`${month}-31`)
            }
        }).select("views aurthor");

        if (!allPosts.length) {
            return res.status(404).send({ message: "No posts found this month" });
        }

        // 3. Get this user’s posts & views
        const userPosts = allPosts.filter(p => p.aurthor === email);
        const userViews = userPosts.reduce((sum, p) => sum + (p.views || 0), 0);

        // 4. Calculate earnings by views (1000 views = $1)
        let userEarnings = (userViews / 1000) * 1; // $ per 1000 views
        userEarnings = userEarnings * platformShare; // apply platform share

        // 5. Ensure not exceeding monthlyRevenue
        if (userEarnings > totalRevenue) {
            userEarnings = totalRevenue;
        }
        // console.log(totalRevenue,userEarnings)
        const totalViews = allPosts.reduce((sum, p) => sum + (p.views || 0), 0);
        const userViewPercentage = totalViews > 0 ? (userViews / totalViews) : 0;

        return res.send({
            email,
            month,
            totalRevenue: `$${totalRevenue}`,
            userViews,
            rate: "1000 views = $1",
            userViewPercentage: (userViewPercentage * 100).toFixed(2) + "%",
            platformShare: (platformShare * 100) + "%",
            earnings: `$${userEarnings.toFixed(2)}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error", error });
    }

}




module.exports = {
    sendmoney,
}