const Phone = require('../models/phone');

module.exports.renderPhones = async (req, res, next) => {
    try {
        const phones = await Phone.find({});
        res.render('phones/phones', { phones, title: 'Phones' });
    } catch (err) {
        // This will send it to the next error handler, express handler if none defined
        next(err);
    }
}

module.exports.createPhone = async (req, res, next) => {
    try {
        const phone = new Phone(req.body);
        phone.user = req.user._id;
        phone.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
        await phone.save();
        req.flash('success', 'Successfully added new phone!');
        res.redirect('/phones');
    } catch (err) {
        next(err);
    }
}

module.exports.renderNewPhoneForm = (req, res) => {
    res.render('phones/new-phone', { title: 'New Phone' });
}

module.exports.renderPhone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const phone = await Phone.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'user'
            }
        }).populate('user');
        // Handle error when phone is not found
        if (!phone) {
            req.flash('error', 'Cannot find phone!');
            return res.redirect('/phones');
            // throw new AppError(404, 'Phone not found');
        }
        res.render('phones/phone', { phone, title: phone.name });
    } catch (err) {
        req.flash('error', 'Cannot find phone!');
        res.redirect('/phones');
        // next(err);
    }
}

module.exports.updatePhone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const phone = await Phone.findByIdAndUpdate(id, req.body, { runValidators: true });
        phone.images.push(...req.files.map((file, index) => ({ url: file.path, filename: file.filename })));
        await phone.save();
        req.flash('success', 'Successfully updated phone');
        res.redirect(`/phones/${id}`);
    } catch (err) {
        next(err);
    }
}

module.exports.deletePhone = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Phone.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted phone');
        res.redirect('/phones');
    } catch (err) {
        next(err);
    }
}

module.exports.renderEditPhoneForm = async (req, res, next) => {
    try {
        const memories = Phone.schema.obj.memory.enum;
        const storages = Phone.schema.obj.storage.enum;
        const { id } = req.params;
        const phone = await Phone.findById(id);
        if (!phone) {
            req.flash('error', 'Cannot find phone!');
            return res.redirect('/phones');
            // throw new AppError(404, 'Phone not found');
        }
        res.render('phones/edit', { phone, memories, storages, title: 'Edit' });
    } catch (err) {
        req.flash('error', 'Cannot find phone!');
        return res.redirect('/phones');
        // next(err);
    }
}