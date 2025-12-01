import Transaction from "../Models/Transaction.js";

//add transaction


export const addTransaction = async (req, res) => {
    try {

        const { type, category, date, amount, description } = req.body;
        if (!type || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const transaction = await Transaction.create({
            userId: req.user._id,
            type,
            category,
            amount,
            description,
            date,

        });
        return res.status(201).json({ message: "transaction added successfully", transaction })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message })
    };
};

//fetch all transaction

export const getAllTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json(transaction)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message })
    };
};

// search filter 

export const searchFilter = async (req, res) => {
    try {
        const userId = req.user._id;
        const { q } = req.query;
        if (!q || q.trim() === "") {
            return res.status(400).json({ messageL: "Query parameter 'q' is required" })
        }
        const transaction = await Transaction.find({
            userId,
            $or: [
                // { type: { $regex: q, $options: "i" } },
                { category: { $regex: q, $options: "i" } },
                //    {date:{$regex:q,$options:"i"},}
            ]
        }).sort({createdAt:1})
        return res.status(200).json(transaction)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//delete transaction

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) {
            return res.stats(404).json({ message: "transaction not found" })
        };
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this transaction" });
        };
        await transaction.deleteOne();

        return res.status(200).json({ message: "transaction deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message })
    };
};


//update transaction 

export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
        if (!transaction) {
            return res.status(404).json({ message: "transaction not found" })
        }
        return res.status(200).json({ message: "transaction updated successfully", transaction })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message })
    };
};

