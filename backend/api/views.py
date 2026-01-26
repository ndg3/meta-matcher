from django.http import HttpResponse

from .models import MatchupChart

import json

# Create your views here.
def index(request):
    return HttpResponse('index')

def counterpick(request, name):
    warnings = {'warnings': {}}
    try:
        mthr = float(request.GET['mthr'])
    except KeyError:
        mthr = -0.5
    except ValueError:
        mthr = -0.5
        warnings['warnings']['msg_mthr'] = f'could not parse mthr, '\
            f'using default value {mthr}'

    try:
        ctol = float(request.GET['ctol'])
    except KeyError:
        ctol = -0.5
    except ValueError:
        ctol = -0.5
        warnings['warnings']['msg_ctol'] = f'could not parse ctol, '\
            f'using default value {ctol}'

    try:
        weighted = bool(int(request.GET['weighted']))
    except KeyError:
        weighted = True
    except ValueError:
        weighted = True
        warnings['warnings']['msg_weighted'] = f'could not parse weighted, '\
            f'using default value {weighted}'

    result = MatchupChart.counterpick(name, mthr, ctol, weighted)
    result |= warnings if warnings['warnings'] else {}
    return HttpResponse(json.dumps(result | warnings, indent=2),
                        content_type='application/json')
