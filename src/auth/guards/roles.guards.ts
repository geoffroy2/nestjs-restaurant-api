import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler())
        if(!roles) return true ;
        const request = context.switchToHttp().getRequest()
        console.log(request.user)
        const user = request.user
        return matchRoles(roles, user.roles)
    }
}

function matchRoles(roles,userRole) {
    if(!roles.includes(userRole)) return false ;
    return true
}