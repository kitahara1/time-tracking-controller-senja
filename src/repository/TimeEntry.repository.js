import mongoose from 'mongoose';

class TimeEntryRepository {
    constructor(server) {
        this.server = server;
        this.EmployeeModel = server.EmployeeModel;
        this.TimeEntryModel = server.TimeEntryModel;
    }

    /**
     * Log New Time Entry
     * @param data {{
     *   employeeId,
     *   startTime,
     *   endTime,
     *   description,
     *   createdBy
     * }}
     * @return {Promise<number>}
     */
    async CreateLogTime(data) {
        const transaction = await mongoose.startSession();
        transaction.startTransaction();

        try {
            await this.TimeEntryModel.create([{
                employee_id: data.employeeId,
                start_time: data.startTime,
                end_time: data.endTime,
                description: data.description,
                created_by: data.createdBy
            }], {transaction});

            await transaction.commitTransaction();
            transaction.endSession();

            return 0;
        } catch (e) {
            await transaction.abortTransaction();
            transaction.endSession();
            console.error(e);
            this.server.ErrorLog(e);
            throw e;
        }
    }

    /**
     * Log New Time Edit
     * @param data {{
     *   employeeId,
     *   startTime,
     *   endTime,
     *   description,
     *   createdBy
     * }}
     * @return {Promise<number>}
     */
    async EditLogTIme(data) {
        const transaction = await mongoose.startSession();
        transaction.startTransaction();

        try {
            const result = await this.TimeEntryModel.findByIdAndUpdate(
                {_id: data.id},
                {
                    start_time: data.startTime,
                    end_time: data.endTime,
                    description: data.description,
                    updated_by: data.createdBy
                }, {transaction});

            await transaction.commitTransaction();
            transaction.endSession();
            return 0;
        } catch (e) {
            await transaction.abortTransaction();
            transaction.endSession();
            console.error(e);
            this.server.ErrorLog(e);
            throw e;
        }
    }

    /**
     * Get time entry
     * @return {Promise<mongoose.Document & {name: string, email: string, role: string}>}
     */
    async getLogTime(filter) {
        let filterValue = {};

        const startOfDay = new Date(filter.date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(filter.date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const startTime = {
            $gte: startOfDay,
            $lte: endOfDay
        }

        if (filter.employeeId) filterValue.employee_id = filter.employeeId;
        if (filter.date) filterValue.start_time = startTime;

        const data = await this.TimeEntryModel.find(filterValue).select('_id employee_id start_time end_time description');
        return data ? data : null;
    }

    /**
     * Delete time entry
     * @return {Promise<mongoose.Document & {name: string, email: string, role: string}>}
     */
    async deleteLogTime(id) {
        const transaction = await mongoose.startSession();
        transaction.startTransaction();

        try {
            await this.TimeEntryModel.findByIdAndDelete(
                {_id: id});

            await transaction.commitTransaction();
            transaction.endSession();

            return 0;
        } catch (e) {
            await transaction.abortTransaction();
            transaction.endSession();
            console.error(e);
            this.server.ErrorLog(e);
            throw e;
        }
    }

    /**
     * Get time entry by id
     * @return {Promise<mongoose.Document & {name: string, email: string, role: string}>}
     */
    async getTimeEntryById(id) {
        const data = await this.TimeEntryModel.findOne({_id: id}).select('_id employee_id start_time end_time description');
        return data ? data : null;
    }
}

export default TimeEntryRepository