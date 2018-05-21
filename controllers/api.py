# Here go your api methods.
# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

# -------------------------------------------------------------------------
# This is a sample controller
# - index is the default action of any application
# - user is required for authentication and authorization
# - download is for downloading files uploaded in the db (does streaming)
# -------------------------------------------------------------------------


def index():
    """
    example action using the internationalization operator T and flash
    rendered by views/default/index.html or views/generic.html

    if you need a simple wiki simply replace the two lines below with:
    return auth.wiki()
    """
    logger.info('The session is: %r' % session)
    # checklists = None
    # if auth.user is not None:
    checklists = db(db.checklist).select()
    return dict(checklists=checklists)

def get_memo():
    memos = []
    rows = db().select(db.checklist.ALL)
    for i, r in enumerate(rows):
        t = dict(
            id = r.id,
            title = r.title,
            memo_text = r.memo_text,
            is_public = r.is_public,
            user_email = r.user_email,
            updated_on = r.updated_on
        )
        memos.append(t)

    logged_in = auth.user is not None

    if auth.user is not None:
    	email = auth.user.email
    else:
    	email = ''

    return response.json(dict(
        memos=memos,
        logged_in=logged_in,
        user_email=email
    ))


def no_swearing(form):
    if 'fool' in form.vars.memo:
        form.errors.memo = T('No swearing please')

def add_memo():
    m_id = db.checklist.insert(
        title = request.vars.title,
        memo_text = request.vars.memo_text,
        is_public = request.vars.is_public,
    )
    # Also, to clean up, remove tracks that do not belong to anyone.
    # db(db.checklist.m_id == None).delete() 
    # Returns the track info.  Building the dict should likely be done in
    # a shared function, but oh well.
    return response.json(dict(memo=dict(
        id = m_id,
        title = request.vars.title,
        memo_text = request.vars.memo_text,
        is_public = request.vars.is_public
    )))

# @auth.requires_login()
# @auth.requires_signature()
def delete():
	q = ((db.checklist.user_email == auth.user.email) & (db.checklist.id == request.vars.id))
	print(db(q))
	db(q).delete()
    # q = ((db.checklist.user_email == auth.user.email) &
    #          (db.checklist.id == request.args(0)))
    # db(q).delete()
    # redirect(URL('default', 'index'))

def edit():
    q = (db.checklist.id == request.vars.id)
    cl = db(q).update(title=request.vars.title, memo_text=request.vars.memo_text)
    # if form.process(onvalidation=no_swearing).accepted:
    #     # At this point, the record has already been edited.
    #     session.flash = T('Checklist edited.')
    #     redirect(URL('default', 'index'))
    # elif form.errors:
    #     session.flash = T('Please enter correct values.')
    # return dict(form=form)

def toggle_public():
    cl = db(db.checklist.id == request.vars.id).update(is_public=request.vars.is_public)

def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    http://..../[app]/default/user/bulk_register
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    also notice there is http://..../[app]/appadmin/manage/auth to allow administrator to manage users
    """
    return dict(form=auth())


@cache.action()
def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()

