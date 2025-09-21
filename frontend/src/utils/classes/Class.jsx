import formatDate from "../formatDate";
import Course from "./CourseClass";
import User from "./UserClass";

export default class Class {
    constructor(data) {
        this.id = data.id;
        this.courseId = data.courseId;
        this.teacherId = data.teacherId;
        this.name = data.name;
        this.schedule = data.schedule;
        this.startDate = new Date(data.startDate);
        this.endDate = new Date(data.endDate);
        this.status = data.status;
        this.progress = data.progress;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
        this.revision = data.revision;
        this.course = data.course ? new Course(data.course) : null;
        this.teacher = data.teacher ? new User(data.teacher) : null;
        this.class_enrollments = data.class_enrollments ? data.class_enrollments.map(enrollment => ({
            id: enrollment.id,
            studentId: enrollment.studentId,
            childId: enrollment.childId,
            status: enrollment.status,
            progress: enrollment.progress,
            student: enrollment.student ? new User(enrollment.student) : null,
            child: enrollment.child ? {
                id: enrollment.child.id,
                name: enrollment.child.name,
                gender: enrollment.child.gender,
                relationship: enrollment.child.relationship,
                parent: enrollment.child.parent ? new User(enrollment.child.parent) : null
            } : null,
        })) : [];
        this.assignments = data.assignments ? data.assignments.map(assignment => ({
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            dueDate: new Date(assignment.dueDate),
            createdAt: new Date(assignment.createdAt),
            updatedAt: new Date(assignment.updatedAt),
            deletedAt: assignment.deletedAt ? new Date(assignment.deletedAt) : null,
            class: assignment.class ? new Class(assignment.class) : null
        })) : [];
        this.lessons = data.lessons ? data.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            order: lesson.order,
            code: lesson.code,
            createdAt: new Date(lesson.createdAt),
            updatedAt: new Date(lesson.updatedAt),
            deletedAt: lesson.deletedAt ? new Date(lesson.deletedAt) : null,
            class: lesson.class ? {
                id: lesson.class.id,
                name: lesson.class.name
            } : null
        })) : [];
    }

    get formattedStart() {
        return formatDate(this.startDate);
    }
    get formattedEnd() {
        return formatDate(this.endDate);
    }

    get formattedCreatedAt() {
        return formatDate(this.createdAt);
    }

    get formattedUpdatedAt() {
        return formatDate(this.updatedAt);
    }

    get formattedDeletedAt() {
        return this.deletedAt ? formatDate(this.deletedAt) : "";
    }
}